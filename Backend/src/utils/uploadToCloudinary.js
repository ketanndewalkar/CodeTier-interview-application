import fs from "fs/promises";
import cloudinary from "../config/cloudinary.js"

export const uploadResumeToCloudinary = async (filePath) => {
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder: "interview-platform/resumes",
    });

    await fs.unlink(filePath);

    return response;
  } catch (error) {
    await fs.unlink(filePath).catch(() => {});

    throw error;
  }
};