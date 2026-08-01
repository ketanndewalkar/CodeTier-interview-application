import {
  Application,
  Application as JobApplication,
} from "../models/application.model.js";
import { Job as JobOpening } from "../models/job.model.js";
import { CandidateAvailability } from "../models/candidateavailability.model.js";

import eligibilityService from "./eligibilityService.js";
import availabilityService from "./availabilityService.js";
import workloadService from "./workloadService.js";
import slotGenerationService from "./slotGenerationService.js";
import scoringService from "./scoringService.js";
import rankingService from "./rankingService.js";
import interviewCreationService, {
  InterviewCreationService,
  SlotConflictError,
  LockAcquisitionError,
} from "./interviewCreationService.js";
import notificationService from "./notificationService.js";
import { addDays } from "../utils/intervalUtils.js";
import config from "../config/scheduling.config.js";
import { interviewQueue } from "../utils/queue.js";

class SchedulingService {
  /**
   * Runs the full pipeline for a single application: load context ->
   * eligibility (domain/skill check) -> per-interviewer free/feasible slot
   * computation (parallel, no overlap, buffer-respecting) -> scoring ->
   * ranking -> transactional commit with fallback through ranked
   * candidates on conflict.
   */
  async scheduleInterview(applicationId) {
    const application = await JobApplication.findById(applicationId).lean();
    if (!application) {
      return this._fail(applicationId, "Application not found");
    }
    application.schedulingStatus = "SCHEDULING";
    const [jobOpening, candidateAvailability] = await Promise.all([
      JobOpening.findById(application.jobOpeningId).lean(),
      CandidateAvailability.findOne({ applicationId }).lean(),
    ]);

    if (!jobOpening) return this._fail(applicationId, "JobOpening not found");
    if (!candidateAvailability || !candidateAvailability.slots?.length) {
      return this._fail(
        applicationId,
        "Candidate has not submitted availability",
      );
    }

    const duration = jobOpening.interviewConfig?.duration;
    const bufferMinutes =
      jobOpening.interviewConfig?.bufferTime ?? config.DEFAULT_BUFFER_MINUTES;

    if (!duration) {
      return this._fail(
        applicationId,
        "JobOpening.interviewConfig.duration is required",
      );
    }

    // ---- Step 2: Domain/skill eligibility check ----
    const eligible = await eligibilityService.findEligibleInterviewers(
      jobOpening.requiredSkills,
    );
    if (eligible.length === 0) {
      return this._fail(
        applicationId,
        "No interviewers match the required skills/domain",
      );
    }

    const interviewerIds = eligible.map((e) => e.interviewer._id);

    const dateWindow = this._computeDateWindow(
      candidateAvailability.slots,
      config.SCHEDULING_WINDOW_DAYS,
    );

    const result = await this._runPipelineForWindow({
      eligible,
      interviewerIds,
      candidateAvailability,
      dateWindow,
      duration,
      bufferMinutes,
      organizationId: application.organizationId,
      application,
      requiredSkills: jobOpening.requiredSkills,
    });

    if (result.status === "SCHEDULED") return result;

    // Widen the window once and retry if nothing was feasible.
    const widenedWindow = this._computeDateWindow(
      candidateAvailability.slots,
      config.WIDENED_WINDOW_DAYS,
    );

    const retryResult = await this._runPipelineForWindow({
      eligible,
      interviewerIds,
      candidateAvailability,
      dateWindow: widenedWindow,
      duration,
      bufferMinutes,
      organizationId: application.organizationId,
      application,
      requiredSkills: jobOpening.requiredSkills,
    });

    if (retryResult.status !== "SCHEDULED") {
      await notificationService.notifySchedulingFailed(
        applicationId,
        retryResult.reason,
      );
    }
    return retryResult;
  }

  _computeDateWindow(candidateSlots, days) {
    const earliestCandidateSlot = candidateSlots.reduce(
      (min, s) => (s.start < min ? s.start : min),
      candidateSlots[0].start,
    );
    const startDate = new Date(
      Math.max(Date.now(), new Date(earliestCandidateSlot).getTime()),
    );
    const endDate = addDays(startDate, days);
    return { startDate, endDate };
  }

  async _runPipelineForWindow({
    eligible,
    interviewerIds,
    candidateAvailability,
    dateWindow,
    duration,
    bufferMinutes,
    organizationId,
    application,
    requiredSkills,
  }) {
    // ---- Batched reads (avoid N+1) ----
    const [availabilityMap, scheduledMap] = await Promise.all([
      availabilityService.getBulkAvailability(interviewerIds),
      availabilityService.getBulkScheduledIntervals(interviewerIds, dateWindow),
    ]);

    const weeklyCapacityByInterviewer = new Map();
    for (const id of interviewerIds) {
      const avail = availabilityMap.get(String(id));
      weeklyCapacityByInterviewer.set(
        String(id),
        avail
          ? workloadService.computeWeeklyCapacityMinutes(
              avail.recurringAvailability || [],
            )
          : 0,
      );
    }

    const { byInterviewer: workloadMap, orgAvgUtilizationRatio } =
      await workloadService.getBulkWeeklyWorkload(
        interviewerIds,
        dateWindow.startDate,
        weeklyCapacityByInterviewer,
      );

    // ---- Step 3+4: per-interviewer slot generation + scoring, parallel ----
    const now = new Date();
    const scored = await Promise.all(
      eligible.map(async ({ interviewer, matchedSkills }) => {
        const key = String(interviewer._id);
        const interviewerAvailability = availabilityMap.get(key) || {
          recurringAvailability: [],
          blockedSlots: [],
          timezone: "Asia/Kolkata",
        };
        const scheduledIntervals = scheduledMap.get(key) || [];

        const { feasibleSlots } = slotGenerationService.computeFeasibleSlots({
          interviewerAvailability,
          scheduledIntervals,
          candidateSlots: candidateAvailability.slots,
          dateWindow,
          durationMinutes: duration,
          bufferMinutes,
        });

        if (feasibleSlots.length === 0) return null; // rejected: no common slot

        const workloadContext = workloadMap.get(key) || {
          interviewsToday: 0,
          interviewsThisWeek: 0,
          scheduledIntervalsToday: [],
          scheduledIntervalsThisWeek: [],
          lastInterviewEndTime: null,
          weeklyCapacityMinutes: weeklyCapacityByInterviewer.get(key) || 0,
          weeklyBookedMinutes: 0,
        };

        return scoringService.scoreInterviewer({
          interviewerId: interviewer._id,
          matchedSkills,
          requiredSkills,
          feasibleSlots,
          workloadContext,
          orgAvgUtilizationRatio,
          now,
        });
      }),
    );

    const validScored = scored.filter(Boolean);

    if (validScored.length === 0) {
      return {
        status: "NO_FEASIBLE_INTERVIEWER",
        reason: "No interviewer has a slot overlapping candidate availability",
      };
    }

    // ---- Step 5: Ranking ----
    const ranked = rankingService.rank(validScored);

    // ---- Step 6+7: commit, falling back through top-ranked candidates on conflict ----
    const fallbackPool = ranked.slice(0, config.MAX_FALLBACK_CANDIDATES);

    for (const candidate of fallbackPool) {
      try {
        const interview = await interviewCreationService.createInterview({
          applicationId: application._id,
          candidateId: application.candidateId,
          interviewerId: candidate.interviewerId,
          organizationId,
          slot: candidate.bestSlot,
          duration,
          jobOpeningId: application.jobOpeningId,
          bufferMinutes,
          scoringSnapshot: {
            totalScore: candidate.totalScore,
            breakdown: candidate.breakdown,
            rankedAlternatives: ranked.map((r) => ({
              interviewerId: r.interviewerId,
              totalScore: r.totalScore,
            })),
          },
        });

        await notificationService.notifyInterviewScheduled(interview);
        const updatedApplication = await Application.findByIdAndUpdate(
          application._id,
          {
            schedulingStatus: "INTERVIEW_SCHEDULED",
          },
        );

        const startDate = new Date(interview.startTime);

        // 10 minutes before interview
        const reminderTime = startDate.getTime() - 10 * 60 * 1000;
        const delay = reminderTime - Date.now();
        console.log(delay, "   ", interview._id);
        await interviewQueue.add(
          "prepare-interview",
          {
            interviewId: interview._id,
          },
          {
            delay,
            attempts: 5,
            backoff: {
              type: "fixed",
              delay: 10000,
            },
          },
        );
        return { status: "SCHEDULED", interview, rankedCandidates: ranked };
      } catch (err) {
        if (
          err instanceof SlotConflictError ||
          err instanceof LockAcquisitionError
        ) {
          continue; // try the next-ranked interviewer
        }
        throw err;
      }
    }
    return {
      status: "CONFLICT_RETRY_EXHAUSTED",
      reason: `Top ${fallbackPool.length} ranked interviewers all had a slot conflict at commit time`,
      rankedCandidates: ranked,
    };
  }

  async _fail(applicationId, reason) {
    await notificationService.notifySchedulingFailed(applicationId, reason);
    return { status: "NO_FEASIBLE_INTERVIEWER", reason };
  }
}

export default new SchedulingService();
