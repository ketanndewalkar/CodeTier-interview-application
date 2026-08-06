import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadResumeToCloudinary } from "../utils/uploadToCloudinary.js";
import { CandidateAvailability } from "../models/candidateavailability.model.js";

/**
 * GET /api/v1/application/organization
 * Returns ALL applications for the logged-in organization,
 * with candidateId, jobOpeningId populated.
 */
export const getOrganizationApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ organizationId: req.user._id.toString() })
    .populate("candidateId", "name email phone avatarUrl")
    .populate("jobOpeningId", "title requiredSkills experience applicationDeadline status")
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, "Organization applications fetched.", applications));
});

/**
 * GET /api/v1/application/candidate
 * Returns all applications submitted by the logged-in candidate,
 * with job title and requiredSkills populated.
 */
export const getCandidateApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidateId: req.user._id })
    .populate("jobOpeningId", "title requiredSkills applicationDeadline status")
    .populate("organizationId", "name industry logo")
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, "Candidate applications fetched.", applications));
});

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
    portfolioLinks: portfolioLinksRaw,
    yearsOfExperience,
    expectedSalary,
    noticePeriod,
    currentLocation,
    message,
  } = req.body;

  // portfolioLinks is sent as a JSON string from multipart/form-data
  let portfolioLinks = [];
  if (portfolioLinksRaw) {
    try {
      portfolioLinks = typeof portfolioLinksRaw === 'string'
        ? JSON.parse(portfolioLinksRaw)
        : portfolioLinksRaw;
    } catch {
      throw new ApiError(400, "Invalid portfolioLinks format");
    }
  }

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
    existApplication.schedulingStatus = "WAITING_FOR_AVAILABILITY";
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

/**
 * PATCH /api/v1/application/:id/candidate-update
 * Allows the candidate who submitted the application to update editable fields,
 * but ONLY while the application status is still "APPLIED".
 */
export const updateCandidateApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Application ID is required.");

  const application = await Application.findById(id);
  if (!application) throw new ApiError(404, "Application not found.");

  // Only the applicant can update
  if (application.candidateId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized.");
  }

  // Only editable while APPLIED
  if (application.applicationStatus !== "APPLIED") {
    throw new ApiError(
      403,
      `Application can only be edited while in APPLIED status. Current status: ${application.applicationStatus}`
    );
  }

  const {
    coverLetter,
    portfolioLinks: portfolioLinksRaw,
    yearsOfExperience,
    expectedSalary,
    noticePeriod,
    currentLocation,
    message,
  } = req.body;

  let portfolioLinks;
  if (portfolioLinksRaw !== undefined) {
    try {
      portfolioLinks =
        typeof portfolioLinksRaw === "string"
          ? JSON.parse(portfolioLinksRaw)
          : portfolioLinksRaw;
    } catch {
      throw new ApiError(400, "Invalid portfolioLinks format");
    }
  }

  if (coverLetter !== undefined) application.coverLetter = coverLetter;
  if (portfolioLinks !== undefined) application.portfolioLinks = portfolioLinks;
  if (yearsOfExperience !== undefined) application.yearsOfExperience = yearsOfExperience;
  if (expectedSalary !== undefined) application.expectedSalary = expectedSalary;
  if (noticePeriod !== undefined) application.noticePeriod = noticePeriod;
  if (currentLocation !== undefined) application.currentLocation = currentLocation;
  if (message !== undefined) application.message = message;

  await application.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Application updated successfully.", application));
});
