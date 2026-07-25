import express from "express";
import { authMiddleware, isAllowed } from "../middlewares/auth.middleware.js";
import {
  deleteAvailability,
  getAvailability,
  submitAvailability,
  updateAvailability,
} from "../controllers/slot.controller.js";

const router = express.Router();

router
  .get(
    "/application/:id",
    authMiddleware,
    isAllowed("CANDIDATE"),
    getAvailability,
  )
  .post(
    "/application/:id",
    authMiddleware,
    isAllowed("CANDIDATE"),
    submitAvailability,
  )
  .patch(
    "/application/:id",
    authMiddleware,
    isAllowed("CANDIDATE"),
    updateAvailability,
  )
  .delete(
    "/application/:id",
    authMiddleware,
    isAllowed("CANDIDATE"),
    deleteAvailability,
  );

export const slotRoutes = router
