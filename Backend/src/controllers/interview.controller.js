import { Interview } from "../models/interview.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const joinInterview = asyncHandler(async (req, res) => {

    const interview = await Interview.findById(req.params.id);

    if (!interview)
        throw new ApiError(404, "Interview not found");

    const isCandidate =
        interview.candidateId.equals(req.user._id);

    const isInterviewer =
        interview.interviewerIds.some(id =>
            id.equals(req.user._id)
        );

    if (!isCandidate && !isInterviewer)
        throw new ApiError(403, "Unauthorized");

    if (interview.interviewStatus !== "READY")
        throw new ApiError(400, "Interview not ready");

    return res.json({

        role: isCandidate
            ? "candidate"
            : "interviewer",

        roomId: interview.roomId,

        workspaceId: interview.workspaceId,

        environmentId: interview.environmentId,

        language: interview.language

    });

});

export const getCandidateInterviews = asyncHandler(async (req, res) => {
    const candidateId = req.user._id;

    const interviews = await Interview.find({ candidateId })
        .populate({
            path: "applicationId",
            populate: [
                { path: "candidateId", select: "name email avatarUrl" },
                { path: "jobOpeningId", select: "title requiredSkills experience applicationDeadline status" },
                { path: "organizationId", select: "name logo isVerified" },
            ],
        })
        .populate("organizationId", "name logo")
        .sort({ startTime: 1 })
        .lean();

    return res.status(200).json({
        statusCode: 200,
        message: "Candidate interviews fetched.",
        data: interviews
    });
});

export const getInterviewerInterviews = asyncHandler(async (req, res) => {
    const interviewerId = req.user._id;

    const interviews = await Interview.find({ interviewerId })
        .populate({
            path: "applicationId",
            populate: [
                { path: "candidateId", select: "name email avatarUrl" },
                { path: "jobOpeningId", select: "title requiredSkills experience applicationDeadline status" },
                { path: "organizationId", select: "name logo isVerified" },
            ],
        })
        .populate("candidateId", "name email avatarUrl")
        .populate("organizationId", "name logo")
        .sort({ startTime: 1 })
        .lean();
    return res.status(200).json({
        statusCode: 200,
        message: "Interviewer interviews fetched.",
        data: interviews
    });
});

export const getOrganizationInterviews = asyncHandler(async (req, res) => {
    const organizationId = req.user._id;

    const interviews = await Interview.find({ organizationId })
        .populate({
            path: "applicationId",
            populate: [
                { path: "candidateId", select: "name email phone avatarUrl" },
                { path: "jobOpeningId", select: "title requiredSkills experience applicationDeadline status" },
            ],
        })
        .populate("candidateId", "name email phone avatarUrl")
        .populate("interviewerId", "name email")
        .sort({ startTime: 1 })
        .lean();

    return res.status(200).json({
        statusCode: 200,
        message: "Organization interviews fetched.",
        data: interviews
    });
});
