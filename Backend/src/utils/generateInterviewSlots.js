import { addMinutes } from './intervalUtils.js';

/**
 * Slices free (already buffer-safe) intervals into discrete interview-sized
 * slots, spaced `durationMinutes + bufferMinutes` apart, so that two
 * candidate slots generated back-to-back for the SAME interviewer also
 * respect the buffer (not just slots vs. pre-existing bookings).
 *
 * Complexity: O(totalFreeMinutes / step) per interviewer.
 */
function generateInterviewSlots(freeIntervals, durationMinutes, bufferMinutes) {
  const slots = [];
  const step = durationMinutes + bufferMinutes;

  for (const interval of freeIntervals) {
    let cursor = interval.start;
    while (addMinutes(cursor, durationMinutes) <= interval.end) {
      slots.push({
        start: cursor,
        end: addMinutes(cursor, durationMinutes),
        // kept for fragmentation scoring: which free block this slot came from
        parentInterval: interval,
      });
      cursor = addMinutes(cursor, step);
    }
  }

  return slots;
}

export default generateInterviewSlots;
