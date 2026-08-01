import { Interview } from '../models/interview.model.js';
import { Application as JobApplication } from '../models/application.model.js';
import { padInterval } from '../utils/intervalUtils.js';
import { withLock, LockAcquisitionError } from '../utils/lock.js';
import config from '../config/scheduling.config.js';
import { Job } from '../models/job.model.js';

class SlotConflictError extends Error {}

class InterviewCreationService {
  /**
   * Re-checks, inside the lock and right before commit, that the chosen
   * slot (padded by the buffer) is STILL free for this interviewer. This
   * is the actual correctness guarantee -- the lock only reduces
   * contention, this check is what prevents a double-booking from ever
   * being written.
   */
  async _isSlotStillFree(interviewerId, slot, bufferMinutes) {
    const padded = padInterval(slot, bufferMinutes);
    const conflict = await Interview.findOne({
      interviewerId,
      status: { $in: config.ACTIVE_INTERVIEW_STATUSES },
      startTime: { $lt: padded.end },
      endTime: { $gt: padded.start },
    }).lean();

    return !conflict;
  }

  /**
   * Attempts to create the Interview document for a single (interviewer,
   * slot) pair inside a lock. Throws SlotConflictError if the
   * slot was taken concurrently -- caller decides whether to fall back to
   * the next-ranked interviewer or retry.
   * 
   * NOTE: Uses in-memory lock instead of MongoDB transactions for compatibility
   * with standalone MongoDB. Lock prevents concurrent writes for the same interviewer.
   */
  async createInterview({
    applicationId,
    candidateId,
    interviewerId,
    organizationId,
    jobOpeningId,
    slot,
    duration,
    bufferMinutes,
    scoringSnapshot,
  }) {
    const lockKey = `lock:interviewer:${interviewerId}`;

    return withLock(lockKey, 15000, async () => {
      const stillFree = await this._isSlotStillFree(
        interviewerId,
        slot,
        bufferMinutes
      );

      if (!stillFree) {
        throw new SlotConflictError(
          `Slot ${slot.start.toISOString()} - ${slot.end.toISOString()} for interviewer ${interviewerId} was taken concurrently`
        );
      }
      const job = await Job.findById(jobOpeningId);
      const environmentId = job?.interviewConfig?.environmentId ?? job?.environmentId;

      if (!environmentId) {
        throw new Error('Job opening is missing interview environmentId');
      }

      const createdInterview = await Interview.create({
        applicationId,
        candidateId,
        interviewerId,
        organizationId,
        startTime: slot.start,
        endTime: slot.end,
        duration,
        status: 'SCHEDULED',
        scoringSnapshot,
        environmentId,
      });

      // NOTE: JobApplication.applicationStatus enum (APPLIED / SHORTLISTED /
      // REJECTED / HIRED) has no "interview scheduled" value, so we only
      // link interviewId here and leave applicationStatus untouched,
      // per the instruction not to alter existing schema semantics.
      await JobApplication.updateOne(
        { _id: applicationId },
        { interviewId: createdInterview._id }
      );

      return createdInterview;
    });
  }
}

export { InterviewCreationService, SlotConflictError, LockAcquisitionError };
export default new InterviewCreationService();
