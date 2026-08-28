import { Interview } from "../models/interview.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { InterviewEnvironment } from "../models/environment.model.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js"
import { removeRoom, rooms } from "../websocket/rooms/room.manager.js";
import fs from "fs/promises"
import { readDirectory } from "../utils/readDirectory.js";
import mongoose from "mongoose";
import path from "path";
import { broadcastToRoom } from "../websocket/utils/broadcaster.js";
export const joinInterview = asyncHandler(async (req, res) => {

    const interview = await Interview.findById(req.params.id);

    if (!interview)
        throw new ApiError(404, "Interview not found");

    const interviewEnvironment = await InterviewEnvironment.findOne({
        interviewId: interview._id
    })
    console.log(interviewEnvironment)
    if (!interviewEnvironment) {
        throw new ApiError(500, "No Live Environment Exists.")
    }

    if (interviewEnvironment.status == "PROVISIONING") {
        throw new ApiError(500, "Environment is ready yet.")
    }

    const isCandidate =

        interview.candidateId.equals(req.user._id);

    const isInterviewer =
        interview.interviewerId.equals(req.user._id);

    if (req.user.role == "CANDIDATE" && !isCandidate || req.user.role == "INTERVIEWER" && !isInterviewer)
        throw new ApiError(403, "Unauthorized");


    return res.status(200).json(new ApiResponse(200, "Interview Info Fetched Successfully", {
        role: req.user.role,
        roomId: interviewEnvironment.roomId,
        workspacePath: interviewEnvironment.workspacePath,
        environmentId: interviewEnvironment.environmentId,
    }));

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
    console.log(interviews)
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

export const stopInterviewEnvironment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const interview = await Interview.findById(id);

    if (!interview) {
        throw new ApiError(401, "Interview Dont Exist")
    }

    const isInterview = interview.interviewId == req.user._id ? true : false;

    if (!isOwner && user.role != "INTERVIEWER") {
        throw new ApiError(401, "UnAuthorized Feature Discovered.")
    }

    const interviewEnvironment = await InterviewEnvironment.find({ interviewId: interview._id });
    if (!interviewEnvironment) {
        throw new ApiError(401, "No Such Environment Exist.");
    }

    //Stop the COntainer
    const container = await docker.getContainer(interviewEnvironment.containerId);
    await container.stop();
    await container.remove();

    //remove the Room Existence from the Room Map
    removeRoom(interviewEnvironment.roomId);

    //Delete Workspace used for interview
    await fs.rm(interviewEnvironment.workspacePath, { recursive: true })

    //status Updated for Docker Envronment
    interviewEnvironment.status = "DESTROYED"
    await interviewEnvironment.save();

    //status updated for Interview
    interview.status = "COMPLETED";
    await interview.save();

    res.status(200).json(new ApiResponse(200, "Interview Stopped Successfully."));
})

export const fetchInterviewById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(401, "ID is required.")
    }

    const interview = await Interview.findById(id).populate("interviewerId candidateId").exec()

    if (!interview) {
        throw new ApiError(401, "No Such Interview Exists.")
    }

    res.status(200).json(new ApiResponse(200, "Fetched Successfully", interview))
})

export const fetchRoomById = asyncHandler(async (req, res) => {

    const { interviewId, roomId } = req.params;

    if (!interviewId || !roomId) {
        throw new ApiError(401, "Interview ID and Room ID are required.")
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
        throw new ApiError(401, "No Such Interview Exists.")
    }

    const room = rooms.get(roomId);

    if (!room) {
        throw new ApiError(401, "No Such Room Exists.")
    }

    const isParticipant = Array.from(room.participants.values()).some(
        (p) => p.userId.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
        throw new ApiError(401, "User is not a participant of this room.")
    }
    // Convert participants Map to an array and strip socket references to prevent serialization errors
    const roomResponse = {
        roomId: room.roomId,
        status: room.status,
        participants: Array.from(room.participants.values()).map(
            ({ socket, ...participant }) => participant
        )
    };
    res.status(200).json(new ApiResponse(200, "Room Fetched Successfully", roomResponse))
})

export const getInterviewWorkspaceDirectory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(401, "interviewId is required.")
    }

    const interview = await Interview.findById(id);
    if (!interview) {
        throw new ApiError(401, "Interview Dont Exists.")
    }

    const interviewEnvironment = await InterviewEnvironment.findOne({ interviewId: id });

    if (!interviewEnvironment) {
        throw new ApiError(401, "No Such Environment Initialized yet.")
    }
    const { workspacePath } = interviewEnvironment;
    if (!workspacePath) {
        throw new ApiError(500, "Workspace Dont Exist yet.")
    }
    const dirInfo = await readDirectory(workspacePath);

    if (!dirInfo) {
        throw new ApiError(500, "Failed to get the Directory Information");
    }

    res.status(200).json(new ApiResponse(200, "Fetched Info Successfully", dirInfo));
})

export const createWorkspaceEntity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { path: relativePath, type } = req.body || {};

    if (!id || !relativePath || !type) {
        throw new ApiError(400, "interviewId, path, and type are required.")
    }

    const interview = await Interview.findById(id);
    if (!interview) {
        throw new ApiError(404, "Interview does not exist.")
    }

    const interviewEnvironment = await InterviewEnvironment.findOne({ interviewId: id });
    if (!interviewEnvironment || !interviewEnvironment.workspacePath) {
        throw new ApiError(404, "Workspace environment not found.")
    }

    const targetPath = path.join(interviewEnvironment.workspacePath, relativePath);

    // Prevent directory traversal attacks
    const resolvedPath = path.resolve(targetPath);
    const resolvedWorkspacePath = path.resolve(interviewEnvironment.workspacePath);
    if (!resolvedPath.startsWith(resolvedWorkspacePath)) {
        throw new ApiError(400, "Invalid path: Directory traversal not allowed.")
    }

    if (type === "folder") {
        await fs.mkdir(targetPath, { recursive: true });
    } else {
        // Ensure parent directory exists
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        // Create empty file
        await fs.writeFile(targetPath, "");
    }

    const dirInfo = await readDirectory(interviewEnvironment.workspacePath);

    // Broadcast file tree update to other participants in the room
    broadcastToRoom(interviewEnvironment.roomId, {
        namespace: "WORKSPACE",
        event: "TREE_UPDATED",
        payload: { interviewId: id, dirInfo }
    }, req.user._id.toString());

    res.status(200).json(new ApiResponse(200, "Entity created successfully", dirInfo));
});

export const deleteWorkspaceEntity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const relativePath = req.body?.path || req.query?.path;

    if (!id || !relativePath) {
        throw new ApiError(400, "interviewId and path are required.")
    }

    const interview = await Interview.findById(id);
    if (!interview) {
        throw new ApiError(404, "Interview does not exist.")
    }

    const interviewEnvironment = await InterviewEnvironment.findOne({ interviewId: id });
    if (!interviewEnvironment || !interviewEnvironment.workspacePath) {
        throw new ApiError(404, "Workspace environment not found.")
    }

    const targetPath = path.join(interviewEnvironment.workspacePath, relativePath);

    // Directory traversal guard
    const resolvedPath = path.resolve(targetPath);
    const resolvedWorkspacePath = path.resolve(interviewEnvironment.workspacePath);
    if (!resolvedPath.startsWith(resolvedWorkspacePath) || resolvedPath === resolvedWorkspacePath) {
        throw new ApiError(400, "Invalid path: Deleting workspace root is not allowed.")
    }

    await fs.rm(targetPath, { recursive: true, force: true });

    const dirInfo = await readDirectory(interviewEnvironment.workspacePath);

    // Broadcast file tree update to other participants in the room
    broadcastToRoom(interviewEnvironment.roomId, {
        namespace: "WORKSPACE",
        event: "TREE_UPDATED",
        payload: { interviewId: id, dirInfo }
    }, req.user._id.toString());

    res.status(200).json(new ApiResponse(200, "Entity deleted successfully", dirInfo));
});

export const renameWorkspaceEntity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { oldPath, newPath } = req.body || {};

    if (!id || !oldPath || !newPath) {
        throw new ApiError(400, "interviewId, oldPath, and newPath are required.")
    }

    const interview = await Interview.findById(id);
    if (!interview) {
        throw new ApiError(404, "Interview does not exist.")
    }

    const interviewEnvironment = await InterviewEnvironment.findOne({ interviewId: id });
    if (!interviewEnvironment || !interviewEnvironment.workspacePath) {
        throw new ApiError(404, "Workspace environment not found.")
    }

    const sourcePath = path.join(interviewEnvironment.workspacePath, oldPath);
    const destinationPath = path.join(interviewEnvironment.workspacePath, newPath);

    // Directory traversal guards
    const resolvedSource = path.resolve(sourcePath);
    const resolvedDestination = path.resolve(destinationPath);
    const resolvedWorkspacePath = path.resolve(interviewEnvironment.workspacePath);

    if (!resolvedSource.startsWith(resolvedWorkspacePath) || resolvedSource === resolvedWorkspacePath ||
        !resolvedDestination.startsWith(resolvedWorkspacePath) || resolvedDestination === resolvedWorkspacePath) {
        throw new ApiError(400, "Invalid path traversal or operation on root not allowed.")
    }

    // Ensure target parent directory exists
    await fs.mkdir(path.dirname(destinationPath), { recursive: true });

    await fs.rename(sourcePath, destinationPath);

    const dirInfo = await readDirectory(interviewEnvironment.workspacePath);

    // Broadcast file tree update to other participants in the room
    broadcastToRoom(interviewEnvironment.roomId, {
        namespace: "WORKSPACE",
        event: "TREE_UPDATED",
        payload: { interviewId: id, dirInfo }
    }, req.user._id.toString());

    res.status(200).json(new ApiResponse(200, "Entity renamed successfully", dirInfo));
});

export const fetchWorkspaceFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const relativePath = req.query.path || req.body?.path;

    if (!id || !relativePath) {
        throw new ApiError(400, "interviewId and path are required.")
    }

    const interview = await Interview.findById(id);
    if (!interview) {
        throw new ApiError(404, "Interview does not exist.")
    }

    const interviewEnvironment = await InterviewEnvironment.findOne({ interviewId: id });
    if (!interviewEnvironment || !interviewEnvironment.workspacePath) {
        throw new ApiError(404, "Workspace environment not found.")
    }

    const targetPath = path.join(interviewEnvironment.workspacePath, relativePath);

    // Prevent directory traversal attacks
    const resolvedPath = path.resolve(targetPath);
    const resolvedWorkspacePath = path.resolve(interviewEnvironment.workspacePath);
    if (!resolvedPath.startsWith(resolvedWorkspacePath)) {
        throw new ApiError(400, "Invalid path: Directory traversal not allowed.")
    }

    try {
        const content = await fs.readFile(targetPath, "utf-8");
        res.status(200).json(new ApiResponse(200, "File content fetched successfully", { path: relativePath, content }));
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new ApiError(404, "File not found on disk.")
        }
        throw error;
    }
});

export const updateWorkspaceFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { path: relativePath, content } = req.body || {};

    if (!id || !relativePath || content === undefined) {
        throw new ApiError(400, "interviewId, path, and content are required.")
    }

    const interview = await Interview.findById(id);
    if (!interview) {
        throw new ApiError(404, "Interview does not exist.")
    }

    const interviewEnvironment = await InterviewEnvironment.findOne({ interviewId: id });
    if (!interviewEnvironment || !interviewEnvironment.workspacePath) {
        throw new ApiError(404, "Workspace environment not found.")
    }

    const targetPath = path.join(interviewEnvironment.workspacePath, relativePath);

    // Prevent directory traversal attacks
    const resolvedPath = path.resolve(targetPath);
    const resolvedWorkspacePath = path.resolve(interviewEnvironment.workspacePath);
    if (!resolvedPath.startsWith(resolvedWorkspacePath)) {
        throw new ApiError(400, "Invalid path: Directory traversal not allowed.")
    }

    await fs.writeFile(targetPath, content, "utf-8");

    // Broadcast file content change to other participants in the room
    broadcastToRoom(interviewEnvironment.roomId, {
        namespace: "WORKSPACE",
        event: "FILE_UPDATED",
        payload: { interviewId: id, path: relativePath, content }
    }, req.user._id.toString());

    res.status(200).json(new ApiResponse(200, "File updated successfully", { path: relativePath }));
});

export const getInterviewEnvironment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "interviewId is required.")
    }

    const env = await InterviewEnvironment.findOne({ interviewId: id });
    if (!env) {
        throw new ApiError(404, "Interview environment not found.")
    }

    res.status(200).json(new ApiResponse(200, "Interview Environment fetched successfully", env));
});
