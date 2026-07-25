
import config from '../config/scheduling.config.js';
import { InterviewerAvailability } from '../models/availability.model.js';
import { Interview } from '../models/interview.model.js';

class AvailabilityService {
  /**
   * Fetches recurring template + blocked slots for a SINGLE interviewer.
   * Prefer getBulkAvailability() for multi-interviewer scheduling runs to
   * avoid N+1 queries.
   */
  async getAvailability(interviewerId) {
    const doc = await InterviewerAvailability.findOne({ interviewerId }).lean();
    if (!doc) {
      // No availability doc yet -- treat as fully unavailable, not an error,
      // so one missing profile can't crash the whole scheduling run.
      return { recurringAvailability: [], blockedSlots: [], timezone: 'Asia/Kolkata' };
    }
    return doc;
  }

  /**
   * Batched fetch for ALL eligible interviewers at once -- avoids N+1 round
   * trips to Mongo when the eligible pool is large.
   * @returns {Map<interviewerId, InterviewerAvailability>}
   */
  async getBulkAvailability(interviewerIds) {
    const docs = await InterviewerAvailability.find({
      interviewerId: { $in: interviewerIds },
    }).lean();

    const map = new Map();
    for (const doc of docs) {
      map.set(String(doc.interviewerId), doc);
    }
    // Interviewers with no availability doc simply won't appear in the map;
    // callers should default to "no availability" rather than throwing.
    return map;
  }

  /**
   * Fetches already-booked interview intervals for a single interviewer
   * within a date window. Uses the { interviewerId, startTime, endTime }
   * compound index -- this is the query that guarantees no overlap.
   */
  async getScheduledIntervals(interviewerId, dateWindow) {
    const interviews = await Interview.find({
      interviewerId,
      status: { $in: config.ACTIVE_INTERVIEW_STATUSES },
      startTime: { $lt: dateWindow.endDate },
      endTime: { $gt: dateWindow.startDate },
    })
      .select('startTime endTime')
      .sort({ startTime: 1 })
      .lean();

    return interviews.map((i) => ({ start: i.startTime, end: i.endTime }));
  }

  /**
   * Batched version -- one query for all eligible interviewers' scheduled
   * intervals, grouped by interviewerId in application code.
   * @returns {Map<interviewerId, Array<{start,end}>>}
   */
  async getBulkScheduledIntervals(interviewerIds, dateWindow) {
    const interviews = await Interview.find({
      interviewerId: { $in: interviewerIds },
      status: { $in: config.ACTIVE_INTERVIEW_STATUSES },
      startTime: { $lt: dateWindow.endDate },
      endTime: { $gt: dateWindow.startDate },
    })
      .select('interviewerId startTime endTime')
      .sort({ interviewerId: 1, startTime: 1 })
      .lean();

    const map = new Map();
    for (const id of interviewerIds) map.set(String(id), []);
    for (const interview of interviews) {
      const key = String(interview.interviewerId);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({ start: interview.startTime, end: interview.endTime });
    }
    return map;
  }
}

export default new AvailabilityService();
