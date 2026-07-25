import express from "express"
import { getMe, login, logOut, refreshToken, signUp, updateProfile } from "../controllers/auth.controller.js";
import { authMiddleware, isAllowed } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login",login);
router.post("/signup",signUp);
router.get("/refresh-token",refreshToken)
router.get("/log-out",authMiddleware,logOut)
router.get("/get-me",authMiddleware,getMe)
router.patch("/profile-update",authMiddleware,isAllowed("INTERVIEWER","CANDIDATE"),updateProfile)

export const authRoutes = router;