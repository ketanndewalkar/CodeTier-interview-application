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