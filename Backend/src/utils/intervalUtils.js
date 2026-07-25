/**
 * Generic, dependency-free interval algebra.
 * Every interval is { start: Date, end: Date }, in UTC.
 * All computation in the engine happens in UTC -- timezones are applied
 * only at the presentation/notification boundary (see timezoneUtils.js).
 */

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function minutesBetween(a, b) {
  return (b.getTime() - a.getTime()) / 60000;
}

function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}

/**
 * Expands an interval by `minutes` on both sides. Used to enforce a buffer
 * around already-booked interviews (not just newly generated ones), so an
 * interviewer never gets back-to-back interviews with zero breathing room.
 */
function padInterval(interval, minutes) {
  return {
    start: addMinutes(interval.start, -minutes),
    end: addMinutes(interval.end, minutes),
  };
}

/**
 * Merges overlapping/adjacent intervals in a sorted list into the minimal
 * equivalent representation. Safety pass after subtraction operations.
 * Complexity: O(n) given already-sorted input.
 */
function mergeAdjacent(intervals) {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const curr = sorted[i];
    if (curr.start <= last.end) {
      last.end = curr.end > last.end ? curr.end : last.end;
    } else {
      merged.push({ ...curr });
    }
  }
  return merged;
}

/**
 * Subtracts a set of "busy" intervals from a set of "free" intervals.
 * Sweep-line subtraction, O((n + m) log(n + m)) dominated by the sorts.
 */
function subtractIntervals(freeIntervals, busyIntervals) {
  if (busyIntervals.length === 0) return mergeAdjacent(freeIntervals);

  const busy = [...busyIntervals].sort((a, b) => a.start - b.start);
  const result = [];

  for (const free of freeIntervals) {
    let cursor = free.start;

    for (const b of busy) {
      if (b.end <= cursor || b.start >= free.end) continue; // no overlap with remaining window
      if (b.start > cursor) {
        result.push({ start: cursor, end: b.start < free.end ? b.start : free.end });
      }
      cursor = b.end > cursor ? b.end : cursor;
      if (cursor >= free.end) break;
    }

    if (cursor < free.end) {
      result.push({ start: cursor, end: free.end });
    }
  }

  return mergeAdjacent(result);
}

export {
  addMinutes,
  addDays,
  minutesBetween,
  overlaps,
  padInterval,
  mergeAdjacent,
  subtractIntervals,
};
