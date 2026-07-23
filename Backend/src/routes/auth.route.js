import express from "express"
import { getMe, login, logOut, refreshToken, signUp } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login",login);
router.post("/signup",signUp);
router.get("/refresh-token",refreshToken)
router.get("/log-out",authMiddleware,logOut)
router.get("/get-me",authMiddleware,getMe)

export const authRoutes = router;