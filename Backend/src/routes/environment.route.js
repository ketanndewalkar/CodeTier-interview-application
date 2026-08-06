import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAllEnvironments } from "../controllers/environment.controller.js";

const router = express.Router();

router.get("/get-all", authMiddleware, getAllEnvironments);

export const environmentRoutes = router;
