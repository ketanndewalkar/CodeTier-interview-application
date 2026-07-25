import { minutesBetween } from '../../utils/intervalUtils.js';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Rewards interviewers whose weekly booked-minute utilization is BELOW the
 * org average (relative standing, not an absolute cutoff) -- this is the
 * primary fairness lever that stops the scheduler from always picking the
 * same person.
 */
function calculateWorkloadScore(workloadContext, orgAvgUtilizationRatio) {
  if (!workloadContext.weeklyCapacityMinutes) return 50; // no data -> neutral
  const utilizationRatio = workloadContext.weeklyBookedMinutes / workloadContext.weeklyCapacityMinutes;
  const relative = orgAvgUtilizationRatio - utilizationRatio;
  return clamp(50 + relative * 100, 0, 100);
}

function scoreBuffer(gapMinutes, idealMinutes) {
  if (gapMinutes === null) return 50; // no adjacent interview -> neutral/free
  if (gapMinutes >= idealMinutes) return 50;
  if (gapMinutes <= 0) return 0;
  return (gapMinutes / idealMinutes) * 50;
}

/**
 * Rewards slots that leave a healthy buffer before/after neighboring
 * interviews, and penalizes an interviewer already at/over their
 * comfortable daily interview count.
 */
function calculateComfortScore(slot, workloadContext, config) {
  const dayIntervals = [...workloadContext.scheduledIntervalsToday].sort(
    (a, b) => a.start - b.start
  );

  let gapBefore = null;
  let gapAfter = null;

  for (const interval of dayIntervals) {
    if (interval.end <= slot.start) {
      const gap = minutesBetween(interval.end, slot.start);
      if (gapBefore === null || gap < gapBefore) gapBefore = gap;
    }
    if (interval.start >= slot.end) {
      const gap = minutesBetween(slot.end, interval.start);
      if (gapAfter === null || gap < gapAfter) gapAfter = gap;
    }
  }

  const bufferScore =
    (scoreBuffer(gapBefore, config.IDEAL_BUFFER_MINUTES) +
      scoreBuffer(gapAfter, config.IDEAL_BUFFER_MINUTES)) /
    2;

  const dailyLoadPenalty =
    workloadContext.interviewsToday >= config.MAX_COMFORTABLE_INTERVIEWS_PER_DAY ? 25 : 0;

  return clamp(bufferScore - dailyLoadPenalty + 50, 0, 100);
}

/**
 * Penalizes slots that carve an unusably small leftover gap into a free
 * block (e.g. leaving a stranded 10-minute remainder nobody can use).
 */
function calculateFragmentationScore(slot, config) {
  const parent = slot.parentInterval;
  if (!parent) return 50;

  const leftoverBefore = minutesBetween(parent.start, slot.start);
  const leftoverAfter = minutesBetween(slot.end, parent.end);

  const isBadFragment = (mins) => mins > 0 && mins < config.MIN_USABLE_BLOCK_MINUTES;

  let penalty = 0;
  if (isBadFragment(leftoverBefore)) penalty += 25;
  if (isBadFragment(leftoverAfter)) penalty += 25;

  return clamp(100 - penalty, 0, 100);
}

/**
 * Bonus for slots directly adjacent (within the ideal buffer window) to an
 * existing interview -- keeps an interviewer's "interview mode" contiguous
 * rather than scattering single interviews across an otherwise free day.
 */
function calculateContinuityScore(slot, workloadContext, config) {
  const dayIntervals = workloadContext.scheduledIntervalsToday;
  if (dayIntervals.length === 0) return 50; // neutral if no other interviews today

  let minGap = Infinity;
  for (const interval of dayIntervals) {
    if (interval.end <= slot.start) {
      minGap = Math.min(minGap, minutesBetween(interval.end, slot.start));
    } else if (interval.start >= slot.end) {
      minGap = Math.min(minGap, minutesBetween(slot.end, interval.start));
    }
  }

  if (minGap === Infinity) return 50;
  if (minGap <= config.IDEAL_BUFFER_MINUTES) return 80; // close but still buffer-respecting
  if (minGap <= config.IDEAL_BUFFER_MINUTES * 3) return 60;
  return 40; // isolated, single interview stranded in an otherwise free day
}

/**
 * Weighted low per business requirement: candidate convenience matters but
 * must never dominate interviewer comfort. Rewards slots sooner from "now".
 */
function calculateCandidateWaitingScore(slot, now) {
  const daysAway = minutesBetween(now, slot.start) / (60 * 24);
  return clamp(100 - daysAway * 5, 0, 100);
}

/**
 * Tie-breaker-weight-only score, deliberately de-prioritized per the
 * explicit business requirement: "do not simply optimize for earliest slot".
 */
function calculateEarliestSlotScore(slot, allFeasibleSlotsForInterviewer) {
  if (allFeasibleSlotsForInterviewer.length <= 1) return 100;
  const earliest = allFeasibleSlotsForInterviewer[0].start.getTime();
  const latest = allFeasibleSlotsForInterviewer[allFeasibleSlotsForInterviewer.length - 1].start.getTime();
  if (latest === earliest) return 100;
  const position = (slot.start.getTime() - earliest) / (latest - earliest);
  return clamp(100 - position * 100, 0, 100);
}

/**
 * Beyond binary eligibility, rewards a HIGHER proportion of required skills
 * matched (a 4/5 skill match outranks a 1/5 skill match at equal workload).
 */
function calculateSkillRelevanceScore(matchedSkills, requiredSkills) {
  if (!requiredSkills.length) return 50;
  const ratio = matchedSkills.length / requiredSkills.length;
  return clamp(ratio * 100, 0, 100);
}

export {
  clamp,
  calculateWorkloadScore,
  calculateComfortScore,
  calculateFragmentationScore,
  calculateContinuityScore,
  calculateCandidateWaitingScore,
  calculateEarliestSlotScore,
  calculateSkillRelevanceScore,
};
