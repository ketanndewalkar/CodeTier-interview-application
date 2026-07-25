import expandRecurringAvailability from '../utils/expandRecurringAvailability.js';
import subtractBlockedSlots from '../utils/subtractBlockedSlots.js';
import subtractScheduledInterviews from '../utils/subtractScheduledInterviews.js';
import generateInterviewSlots from '../utils/generateInterviewSlots.js';
import intersectCandidateSlots from '../utils/intersectCandidateSlots.js';

/**
 * Computes the full free-slot pipeline for ONE interviewer:
 *   recurring template -> expand -> minus blocked -> minus scheduled
 *   (buffer-padded) -> sliced into interview-length slots -> intersected
 *   with candidate availability.
 *
 * This function is pure given its inputs (no DB calls) so it's cheap to
 * unit test and safe to run in parallel across many interviewers.
 */
class SlotGenerationService {
  computeFeasibleSlots({
    interviewerAvailability,
    scheduledIntervals,
    candidateSlots,
    dateWindow,
    durationMinutes,
    bufferMinutes,
  }) {
    const timezone = interviewerAvailability.timezone || 'Asia/Kolkata';

    let free = expandRecurringAvailability(
      interviewerAvailability.recurringAvailability || [],
      dateWindow,
      timezone
    );

    free = subtractBlockedSlots(free, interviewerAvailability.blockedSlots || []);

    // This is the step that guarantees NO interview overlap for this
    // interviewer, and structurally enforces the buffer around existing
    // bookings (see subtractScheduledInterviews.js).
    free = subtractScheduledInterviews(free, scheduledIntervals, bufferMinutes);

    // Slices remaining free time into interview-length slots, spaced apart
    // by duration + buffer, so even newly generated candidate slots for the
    // SAME interviewer never sit back-to-back with zero gap.
    const generatedSlots = generateInterviewSlots(free, durationMinutes, bufferMinutes);

    const sortedCandidateSlots = [...candidateSlots].sort((a, b) => a.start - b.start);
    const feasibleSlots = intersectCandidateSlots(generatedSlots, sortedCandidateSlots);

    return { feasibleSlots, freeIntervalsBeforeIntersection: free };
  }
}

export default new SlotGenerationService();
