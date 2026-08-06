import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Application } from "../models/application.model.js";
import { Interview } from "../models/interview.model.js";
import { Job } from "../models/job.model.js";

/**
 * GET /api/v1/dashboard/candidate/stats
 *
 * Returns flat numeric metrics + recent applications + upcoming interview
 * that the candidate dashboard consumes in a single round-trip.
 *
 * Response shape:
 * {
 *   totalApplications    : number,
 *   pendingApplications  : number,
 *   shortlisted          : number,
 *   rejected             : number,
 *   hired                : number,
 *   scheduledInterviews  : number,
 *   completedInterviews  : number,
 *   upcomingInterview    : object | null,
 *   activeJobListings    : number,
 *   applicationsByStatus : { status, count }[],
 *   interviewsByStatus   : { status, count }[],
 *   recentApplications   : Application[] (last 5, job info populated),
 * }
 */
export const getCandidateDashboardStats = asyncHandler(async (req, res) => {
  const candidateId = new mongoose.Types.ObjectId(req.user._id);
  const now = new Date();

  const [
    applicationStatusBreakdown,
    interviewStatusBreakdown,
    upcomingInterviewArr,
    activeJobCount,
    recentApplications,
  ] = await Promise.all([
    // --- 1. Application counts grouped by status ---
    Application.aggregate([
      { $match: { candidateId } },
      { $group: { _id: "$applicationStatus", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ]),

    // --- 2. Interview counts grouped by status ---
    Interview.aggregate([
      { $match: { candidateId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ]),

    // --- 3. Nearest upcoming scheduled interview ---
    Interview.find({
      candidateId,
      status: "SCHEDULED",
      startTime: { $gte: now },
    })
      .sort({ startTime: 1 })
      .limit(1)
      .select("startTime endTime duration status")
      .lean(),

    // --- 4. Active job openings on the platform ---
    Job.countDocuments({ status: "OPEN" }),

    // --- 5. Last 5 applications with job info ---
    Application.find({ candidateId })
      .populate("jobOpeningId", "title requiredSkills status")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const appByStatus = Object.fromEntries(
    applicationStatusBreakdown.map(({ status, count }) => [status, count])
  );
  const intByStatus = Object.fromEntries(
    interviewStatusBreakdown.map(({ status, count }) => [status, count])
  );
  const totalApplications = applicationStatusBreakdown.reduce(
    (sum, { count }) => sum + count,
    0
  );

  res.status(200).json(
    new ApiResponse(200, "Dashboard stats fetched successfully", {
      // ── Application metrics ──────────────────────────────────────────
      totalApplications,
      pendingApplications: appByStatus["APPLIED"] ?? 0,
      shortlisted: appByStatus["SHORTLISTED"] ?? 0,
      rejected: appByStatus["REJECTED"] ?? 0,
      hired: appByStatus["HIRED"] ?? 0,

      // ── Interview metrics ────────────────────────────────────────────
      scheduledInterviews:
        (intByStatus["SCHEDULED"] ?? 0) + (intByStatus["IN_PROGRESS"] ?? 0),
      completedInterviews: intByStatus["COMPLETED"] ?? 0,
      upcomingInterview: upcomingInterviewArr[0] ?? null,

      // ── Platform metric ──────────────────────────────────────────────
      activeJobListings: activeJobCount,

      // ── Breakdown arrays (for charts) ────────────────────────────────
      applicationsByStatus: applicationStatusBreakdown,
      interviewsByStatus: interviewStatusBreakdown,

      // ── Recent activity ──────────────────────────────────────────────
      recentApplications,
    })
  );
});
