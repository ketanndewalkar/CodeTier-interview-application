import { application } from "express";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadResumeToCloudinary } from "../utils/uploadToCloudinary.js";
import { CandidateAvailability } from "../models/candidateavailability.model.js";

export const getAllApplication = asyncHandler(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  if (!id) {
    throw new ApiError(401, "Job unique Id required.");
  }
  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError(401, "No Job Exist.");
  }
  const applications = await Application.find({
    organizationId: req.user._id.toString(),
    jobOpeningId: id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Application Fetched", applications));
});

export const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(401, "Invalid Id");
  }

  const application = await Application.findOne({
    organizationId: req.user._id.toString(),
    _id: id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Application Fetched.", application));
});

export const createApplication = asyncHandler(async (req, res) => {
  const { id: jobOpeningId } = req.params;
  const {
    coverLetter,
    portfolioLinks,
    yearsOfExperience,
    expectedSalary,
    noticePeriod,
    currentLocation,
    message,
  } = req.body;
  if (!jobOpeningId) {
    throw new ApiError(401, "Job Opening Id is required");
  }
  const job = await Job.findById(jobOpeningId.toString());
  if (!job) {
    throw new ApiError(401, "No job Exists");
  }

  const response = await uploadResumeToCloudinary(req.file.path);
  if (!response) {
    throw new ApiError(500, "Cloudinary Issue");
  }
  const newApplication = await Application.create({
    candidateId: req.user._id.toString(),
    coverLetter,
    portfolioLinks,
    yearsOfExperience,
    expectedSalary,
    noticePeriod,
    currentLocation,
    message,
    resumeUrl: response.url,
    jobOpeningId,
    organizationId: job.organizationId.toString(),
  });
  if (!newApplication) {
    throw new ApiError(500, "Server Issue");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Applied SuccessFully", newApplication));
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id: applicationId } = req.params;
  const { status } = req.query;
  console.log(applicationId, "    ", status);
  if (!applicationId) {
    throw new ApiError(401, "applicationId is required.");
  }

  if (!status) {
    throw new ApiError(401, "Status is Required.");
  }

  const existApplication = await Application.findById(applicationId);
  if (!existApplication) {
    throw new ApiError(401, "No Such Application Exists.");
  }
  const isOwner =
    existApplication.organizationId.toString() == req.user._id.toString();
  if (!isOwner) {
    throw new ApiError(403, "UnAuthorized.");
  }
  existApplication.applicationStatus = status;
  // await existApplication.save();
  // If the organization is shortlisting the application
  if (existApplication.applicationStatus === "SHORTLISTED") {
    existApplication.schedulingStatus="WAITING_FOR_AVAILABILITY";
    await CandidateAvailability.findOneAndUpdate(
      {
        applicationId: existApplication._id,
      },
      {
        applicationId: existApplication._id,
        candidateId: existApplication.candidateId,
        timezone: "Asia/Kolkata",
        slots: [],
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }
  await existApplication.save()
  return res
    .status(200)
    .json(new ApiResponse(200, "Application Updated.", existApplication));
});
