import { subtractIntervals, padInterval } from './intervalUtils.js';

/**
 * Removes an interviewer's already-scheduled interviews from their free
 * intervals -- this is what guarantees no two interviews for the same
 * interviewer ever overlap.
 *
 * Critically, each existing interview is PADDED by `bufferMinutes` on both
 * sides before subtraction. This is what makes the buffer requirement real:
 * a new interview can never be scheduled to start immediately after (or end
 * immediately before) an existing one -- there's always at least
 * `bufferMinutes` of breathing room, enforced structurally rather than
 * hoped for via scoring alone.
 *
 * @param {Array<{start,end}>} freeIntervals
 * @param {Array<{start,end}>} scheduledInterviews - already-booked intervals for this interviewer
 * @param {number} bufferMinutes
 */
function subtractScheduledInterviews(freeIntervals, scheduledInterviews, bufferMinutes) {
  const paddedBusy = scheduledInterviews.map((interview) =>
    padInterval({ start: interview.start, end: interview.end }, bufferMinutes)
  );
  return subtractIntervals(freeIntervals, paddedBusy);
}

export default subtractScheduledInterviews;
