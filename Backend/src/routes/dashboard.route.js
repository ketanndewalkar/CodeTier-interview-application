import express from "express";
import { authMiddleware, isAllowed } from "../middlewares/auth.middleware.js";
import { getCandidateDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

/**
 * GET /api/v1/dashboard/candidate/stats
 * Protected: CANDIDATE only
 * Returns aggregated numeric stats for the candidate dashboard.
 */
router.get(
  "/candidate/stats",
  authMiddleware,
  isAllowed("CANDIDATE"),
  getCandidateDashboardStats
);

export const dashboardRoutes = router;
