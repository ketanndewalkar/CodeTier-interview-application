/**
 * Two-pointer intersection: keeps only interviewer-generated slots that fit
 * ENTIRELY inside a candidate-submitted availability window. Partial overlap
 * doesn't count -- a candidate who is free 10:00-10:20 cannot take a 30-min
 * interview slot starting at 10:00.
 *
 * Both input arrays must be sorted ascending by start.
 * Complexity: O(n + m)
 */
function intersectCandidateSlots(interviewerSlots, candidateSlots) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < interviewerSlots.length && j < candidateSlots.length) {
    const slot = interviewerSlots[i];
    const cand = candidateSlots[j];

    const fitsEntirely = slot.start >= cand.start && slot.end <= cand.end;

    if (fitsEntirely) {
      result.push(slot);
      i++;
    } else if (slot.end <= cand.start) {
      i++;
    } else if (slot.start >= cand.end) {
      j++;
    } else {
      // Partial overlap only -- not a valid full-fit slot; advance whichever
      // interval ends first to keep the sweep progressing.
      if (slot.end < cand.end) i++;
      else j++;
    }
  }

  return result;
}

export default intersectCandidateSlots;
