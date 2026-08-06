import { Environment } from "../models/environment.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllEnvironments = asyncHandler(async (req, res) => {
  const environments = await Environment.find({ isActive: true });
  return res
    .status(200)
    .json(new ApiResponse(200, "Environments successfully fetched.", environments));
});
