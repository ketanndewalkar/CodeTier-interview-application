import express from "express"
import { authMiddleware, isAllowed } from "../middlewares/auth.middlware.js";
import { changeStatusOfJobOpening, createJobOpening, deleteJobOpening, getAllJobsOpenings, getJobByID, updateJobOpening } from "../controllers/job.controller.js";

const router = express.Router();

router.get("/get-all",authMiddleware,getAllJobsOpenings)
router.get("/:id",authMiddleware,getJobByID)
router.post("/create",authMiddleware,isAllowed("ORGANIZATION"),createJobOpening)
router.patch("/:id",authMiddleware,isAllowed("ORGANIZATION"),updateJobOpening)
router.put("/status/:id",authMiddleware,isAllowed("ORGANIZATION"),changeStatusOfJobOpening)
router.delete("/:id",authMiddleware,isAllowed("ORGANIZATION"),deleteJobOpening)

export const jobRoutes = router