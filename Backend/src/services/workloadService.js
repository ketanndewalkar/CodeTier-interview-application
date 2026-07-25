import { Interview } from '../models/interview.model.js';
import { minutesBetween } from '../utils/intervalUtils.js';
import config from '../config/scheduling.config.js';

function startOfUTCDay(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function startOfUTCWeek(date) {
  const d = startOfUTCDay(date);
  const day = d.getUTCDay(); // 0 = Sunday
  d.setUTCDate(d.getUTCDate() - day);
  return d;
}

class WorkloadService {
  /**
   * One aggregation query for ALL eligible interviewers' weekly workload --
   * used both for the workload scorer and for relative (org-average)
   * comparisons, instead of one query per interviewer.
   */
  async getBulkWeeklyWorkload(interviewerIds, referenceDate, weeklyCapacityMinutesByInterviewer) {
    const weekStart = startOfUTCWeek(referenceDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

    const dayStart = startOfUTCDay(referenceDate);
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const interviews = await Interview.find({
      interviewerId: { $in: interviewerIds },
      status: { $in: [...config.ACTIVE_INTERVIEW_STATUSES, 'COMPLETED'] },
      startTime: { $gte: weekStart, $lt: weekEnd },
    })
      .select('interviewerId startTime endTime')
      .sort({ interviewerId: 1, startTime: 1 })
      .lean();

    const byInterviewer = new Map();
    for (const id of interviewerIds) {
      byInterviewer.set(String(id), {
        interviewsToday: 0,
        interviewsThisWeek: 0,
        scheduledIntervalsToday: [],
        scheduledIntervalsThisWeek: [],
        lastInterviewEndTime: null,
        weeklyBookedMinutes: 0,
      });
    }

    for (const interview of interviews) {
      const key = String(interview.interviewerId);
      const ctx = byInterviewer.get(key);
      if (!ctx) continue;

      const interval = { start: interview.startTime, end: interview.endTime };
      ctx.interviewsThisWeek += 1;
      ctx.scheduledIntervalsThisWeek.push(interval);
      ctx.weeklyBookedMinutes += minutesBetween(interval.start, interval.end);

      if (interval.start >= dayStart && interval.start < dayEnd) {
        ctx.interviewsToday += 1;
        ctx.scheduledIntervalsToday.push(interval);
      }

      if (!ctx.lastInterviewEndTime || interval.end > ctx.lastInterviewEndTime) {
        ctx.lastInterviewEndTime = interval.end;
      }
    }

    // Attach weekly capacity (derived from recurring availability, passed in)
    // and compute the org-wide average utilization ratio for relative scoring.
    let totalRatio = 0;
    let countWithCapacity = 0;

    for (const [key, ctx] of byInterviewer.entries()) {
      const capacity = weeklyCapacityMinutesByInterviewer.get(key) || 0;
      ctx.weeklyCapacityMinutes = capacity;
      if (capacity > 0) {
        totalRatio += ctx.weeklyBookedMinutes / capacity;
        countWithCapacity += 1;
      }
    }

    const orgAvgUtilizationRatio = countWithCapacity > 0 ? totalRatio / countWithCapacity : 0;

    return { byInterviewer, orgAvgUtilizationRatio };
  }

  /**
   * Sums an interviewer's recurring weekly availability into total minutes
   * -- used as the denominator for utilization-ratio-based workload scoring.
   */
  computeWeeklyCapacityMinutes(recurringAvailability) {
    let total = 0;
    for (const entry of recurringAvailability) {
      const [sh, sm] = entry.startTime.split(':').map(Number);
      const [eh, em] = entry.endTime.split(':').map(Number);
      const minutes = eh * 60 + em - (sh * 60 + sm);
      if (minutes > 0) total += minutes;
    }
    return total;
  }
}

export default new WorkloadService();
