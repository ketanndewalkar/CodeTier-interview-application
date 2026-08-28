import express from "express"
import { authMiddleware, isAllowed } from "../middlewares/auth.middleware.js"
import { joinInterview, getCandidateInterviews, getInterviewerInterviews, getOrganizationInterviews, stopInterviewEnvironment, fetchInterviewById, fetchRoomById, getInterviewWorkspaceDirectory, createWorkspaceEntity, renameWorkspaceEntity, deleteWorkspaceEntity, fetchWorkspaceFile, updateWorkspaceFile, getInterviewEnvironment } from "../controllers/interview.controller.js"

const router = express.Router()

router.get("/candidate", authMiddleware, isAllowed("CANDIDATE"), getCandidateInterviews)
router.get("/interviewer", authMiddleware, isAllowed("INTERVIEWER"), getInterviewerInterviews)
router.get("/organization", authMiddleware, isAllowed("ORGANIZATION"), getOrganizationInterviews)
router.get("/:id/join", authMiddleware, isAllowed("CANDIDATE", "INTERVIEWER"), joinInterview)
router.delete("/interview/:id", authMiddleware, stopInterviewEnvironment)
router.get("/interview/:id", authMiddleware, fetchInterviewById)
router.get("/interview/:interviewId/room/:roomId", authMiddleware, isAllowed("CANDIDATE", "INTERVIEWER"), fetchRoomById);
router.get("/interview/:id/workspace", authMiddleware, isAllowed("INTERVIEWER", "CANDIDATE"), getInterviewWorkspaceDirectory)
router.post("/interview/:id/workspace", authMiddleware, isAllowed("INTERVIEWER", "CANDIDATE"), createWorkspaceEntity)
router.put("/interview/:id/workspace/rename", authMiddleware, isAllowed("INTERVIEWER", "CANDIDATE"), renameWorkspaceEntity)
router.delete("/interview/:id/workspace", authMiddleware, isAllowed("INTERVIEWER", "CANDIDATE"), deleteWorkspaceEntity)
router.get("/interview/:id/workspace/file", authMiddleware, isAllowed("INTERVIEWER", "CANDIDATE"), fetchWorkspaceFile)
router.put("/interview/:id/workspace/file", authMiddleware, isAllowed("INTERVIEWER", "CANDIDATE"), updateWorkspaceFile)
router.get("/interview/:id/environment", authMiddleware, isAllowed("INTERVIEWER", "CANDIDATE"), getInterviewEnvironment)
export const interviewRoutes = router;

