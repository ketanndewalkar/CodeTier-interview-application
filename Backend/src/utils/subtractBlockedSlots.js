import { subtractIntervals } from './intervalUtils.js';

/**
 * Removes an interviewer's blocked slots (leaves, meetings, vacations --
 * InterviewerAvailability.blockedSlots) from their free intervals.
 * No buffer is applied here -- a blocked slot is a hard boundary, not a
 * "meeting that needs breathing room" like a scheduled interview is.
 */
function subtractBlockedSlots(freeIntervals, blockedSlots) {
  const busy = blockedSlots.map((b) => ({ start: b.start, end: b.end }));
  return subtractIntervals(freeIntervals, busy);
}

export default subtractBlockedSlots;
