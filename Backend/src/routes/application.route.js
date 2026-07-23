import express from "express"
import { authMiddleware, isAllowed } from "../middlewares/auth.middleware.js"
import { createApplication, getAllApplication, getApplicationById, updateApplicationStatus } from "../controllers/application.controller.js"
import { uploadResume } from "../middlewares/multer.middleware.js"

const router = express.Router()

router.get("/job-opening/:id/get-all",authMiddleware,isAllowed("ORGANIZATION"),getAllApplication)
router.get("/:id",authMiddleware,isAllowed("ORGANIZATION"),getApplicationById)
router.post("/job-opening/:id",authMiddleware,isAllowed("CANDIDATE"),uploadResume.single("resume"),createApplication)
router.post("/:id",authMiddleware,isAllowed("ORGANIZATION"),updateApplicationStatus)

export const ApplicationRoutes = router