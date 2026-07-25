/**
 * Minimal timezone helpers. For a production system you'd lean on a proper
 * library (luxon / date-fns-tz) to handle DST correctly per-IANA-zone;
 * these are written so that dependency is a drop-in swap later without
 * touching any calling code -- only this file's internals would change.
 */

const DAY_NAME_TO_INDEX = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

/**
 * Combines a calendar date (UTC-anchored) with an "HH:mm" local time string
 * for a given IANA timezone, returning a UTC Date.
 *
 * NOTE: for full DST correctness, replace this with
 *   DateTime.fromObject({...}, { zone: timezone }).toUTC().toJSDate()
 * from luxon. Left explicit here so the offset logic isn't hidden.
 */
function combineDateAndTimeInZone(dateUTC, hhmm, timezone) {
  const [hours, minutes] = hhmm.split(':').map(Number);

  // Build a formatter to find the UTC offset for this timezone on this date.
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Construct a naive UTC timestamp for Y-M-D HH:mm in the target zone,
  // then correct using the offset derived by round-tripping through the zone.
  const naiveUTC = new Date(
    Date.UTC(
      dateUTC.getUTCFullYear(),
      dateUTC.getUTCMonth(),
      dateUTC.getUTCDate(),
      hours,
      minutes,
      0
    )
  );

  const zonedParts = formatter.formatToParts(naiveUTC).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  const zonedAsUTC = Date.UTC(
    Number(zonedParts.year),
    Number(zonedParts.month) - 1,
    Number(zonedParts.day),
    Number(zonedParts.hour),
    Number(zonedParts.minute),
    Number(zonedParts.second)
  );

  const offsetMs = zonedAsUTC - naiveUTC.getTime();
  return new Date(naiveUTC.getTime() - offsetMs);
}

function getWeekdayNameInZone(date, timezone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
  });
  return formatter.format(date).toUpperCase();
}

export {
  DAY_NAME_TO_INDEX,
  combineDateAndTimeInZone,
  getWeekdayNameInZone,
};
