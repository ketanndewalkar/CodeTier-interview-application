import express from "express"
import { authMiddleware, isAllowed } from "../middlewares/auth.middleware.js"
import { joinInterview } from "../controllers/interview.controller.js"

const router = express.Router()

router.get("/:id/join",authMiddleware,isAllowed("CANDIDATE","INTERVIEW"),joinInterview)

export const interviewRoutes = router