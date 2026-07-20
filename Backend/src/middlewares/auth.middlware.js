import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    throw new ApiError(401, "Token Not Found");
  }
  console.log(process.env.JWT_TOKEN_SECRET);
  let payload;
  try {
    payload = jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET);
  } catch (error) {
      throw new ApiError(401, "Session Expired");
    
  }

  const user = await User.findById(payload._id);
  req.user = user;

  next();
});
