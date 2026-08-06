import express from "express"
import { authMiddleware, isAllowed } from "../middlewares/auth.middleware.js"
import { createApplication, getAllApplication, getApplicationById, getCandidateApplications, getOrganizationApplications, updateApplicationStatus, updateCandidateApplication } from "../controllers/application.controller.js"
import { uploadResume } from "../middlewares/multer.middleware.js"

const router = express.Router()

// Candidate routes
router.get("/candidate", authMiddleware, isAllowed("CANDIDATE"), getCandidateApplications)
router.patch("/:id/candidate-update", authMiddleware, isAllowed("CANDIDATE"), updateCandidateApplication)

// Organization routes
router.get("/organization", authMiddleware, isAllowed("ORGANIZATION"), getOrganizationApplications)
router.get("/job-opening/:id/get-all", authMiddleware, isAllowed("ORGANIZATION"), getAllApplication)
router.get("/:id", authMiddleware, isAllowed("ORGANIZATION"), getApplicationById)
router.post("/job-opening/:id", authMiddleware, isAllowed("CANDIDATE"), uploadResume.single("resume"), createApplication)
router.post("/:id", authMiddleware, isAllowed("ORGANIZATION"), updateApplicationStatus)

export const ApplicationRoutes = router