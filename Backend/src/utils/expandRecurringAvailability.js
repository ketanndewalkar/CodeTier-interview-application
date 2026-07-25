import { addDays } from './intervalUtils.js';
import { getWeekdayNameInZone, combineDateAndTimeInZone } from './timezoneUtils.js';

/**
 * Converts an interviewer's weekly recurring template
 * (InterviewerAvailability.recurringAvailability) into concrete UTC
 * date-time intervals over a bounded [startDate, endDate] window.
 *
 * Complexity: O(days_in_window) -- constant work per calendar day.
 *
 * @param {Array<{day, startTime, endTime}>} recurringAvailability
 * @param {{ startDate: Date, endDate: Date }} dateWindow
 * @param {string} timezone - interviewer's IANA timezone
 * @returns {Array<{start: Date, end: Date}>} sorted ascending by start
 */
function expandRecurringAvailability(recurringAvailability, dateWindow, timezone) {
  const { startDate, endDate } = dateWindow;

  // Index recurring templates by weekday for O(1) lookup per day.
  const byWeekday = {};
  for (const entry of recurringAvailability) {
    if (!byWeekday[entry.day]) byWeekday[entry.day] = [];
    byWeekday[entry.day].push(entry);
  }

  const result = [];
  let cursor = new Date(startDate);

  while (cursor <= endDate) {
    const weekday = getWeekdayNameInZone(cursor, timezone);
    const templatesForDay = byWeekday[weekday] || [];

    for (const template of templatesForDay) {
      const start = combineDateAndTimeInZone(cursor, template.startTime, timezone);
      const end = combineDateAndTimeInZone(cursor, template.endTime, timezone);
      if (end > start) {
        result.push({ start, end });
      }
    }

    cursor = addDays(cursor, 1);
  }

  return result.sort((a, b) => a.start - b.start);
}

export default expandRecurringAvailability;
