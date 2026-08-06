import express from "express"
import { authMiddleware, isAllowed } from "../middlewares/auth.middleware.js"
import { joinInterview, getCandidateInterviews, getInterviewerInterviews, getOrganizationInterviews } from "../controllers/interview.controller.js"

const router = express.Router()

router.get("/candidate", authMiddleware, isAllowed("CANDIDATE"), getCandidateInterviews)
router.get("/interviewer", authMiddleware, isAllowed("INTERVIEWER"), getInterviewerInterviews)
router.get("/organization", authMiddleware, isAllowed("ORGANIZATION"), getOrganizationInterviews)
router.get("/:id/join", authMiddleware, isAllowed("CANDIDATE", "INTERVIEWER"), joinInterview)

export const interviewRoutes = router
