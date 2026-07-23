import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "No token found");
  }

  const token = authHeader.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Session Expired");
  }

  const user = await User.findById(payload._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  req.user = user;

  next();
});

export const isAllowed = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }
    throw new ApiError(403, "UnAuthorized to access this feature.");
  });
