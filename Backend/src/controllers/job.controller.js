import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllJobsOpenings = asyncHandler(async (req, res) => {
  const { organizationId } = req.query;
  if (organizationId && req.user._id.toString() == organizationId) {
    const jobs = await Job.find({
      organizationId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "Job Successfully Fetched.", jobs));
  }

  const jobs = await Job.find({
    status: {
      $in: ["OPEN", "CLOSED", "PAUSED"],
    },
  });

  // Check which jobs the candidate has applied for
  let appliedJobIds = new Set();
  if (req.user && req.user.role === "CANDIDATE") {
    const applications = await Application.find({ candidateId: req.user._id });
    appliedJobIds = new Set(applications.map(app => app.jobOpeningId.toString()));
  }

  const jobsWithApplied = jobs.map(job => {
    const jobObj = job.toObject();
    jobObj.isApplied = appliedJobIds.has(job._id.toString());
    return jobObj;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Job Successfully fetched", jobsWithApplied));
});

export const createJobOpening = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requiredSkills,
    experience,
    applicationStartDate,
    applicationDeadline,
    interviewDuration,
    bufferTime,
    environmentId,
    interviewMode,
    availabilityType,
    compensation,
    status,
  } = req.body;

  if (
    !title ||
    !description ||
    !requiredSkills ||
    !experience ||
    !applicationStartDate ||
    !applicationDeadline ||
    !interviewDuration ||
    !bufferTime ||
    !environmentId ||
    !interviewMode ||
    !availabilityType
  ) {
    throw new ApiError(401, "All Fields are required");
  }

  const existJob = await Job.findOne({
    title,
    description,
    organizationId: req.user._id.toString(),
  });
  if (existJob) {
    throw new ApiError(401, "Job Already Exist");
  }

  const newJob = await Job.create({
    title,
    description,
    requiredSkills,
    experience,
    applicationStartDate,
    applicationDeadline,
    organizationId: req.user._id.toString(),
    interviewConfig: {
      duration: interviewDuration,
      bufferTime,
      environmentId,
    },
    interviewMode,
    availabilityType,
    status: status || "DRAFT",
    ...(compensation && { compensation }),
  });

  if (!newJob) {
    throw new ApiError(500, "Server Issue");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Published Job Opening", newJob));
});

export const getJobByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(401, "Invalid Unique Parameter");
  }

  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError(401, "Job Opening dont Exist");
  }

  const jobObj = job.toObject();
  let isApplied = false;
  if (req.user && req.user.role === "CANDIDATE") {
    const existApplication = await Application.findOne({
      candidateId: req.user._id,
      jobOpeningId: id,
    });
    isApplied = !!existApplication;
  }
  jobObj.isApplied = isApplied;

  return res.status(200).json(new ApiResponse(200, "Job Opening Fetched", jobObj));
});

export const updateJobOpening = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    requiredSkills,
    experience,
    applicationStartDate,
    applicationDeadline,
    interviewDuration,
    bufferTime,
    environmentId,
    interviewMode,
    availabilityType,
    compensation,
    status,
  } = req.body;

  if (!id) {
    throw new ApiError(401, "Unique Key is required");
  }
  const existJob = await Job.findById(id);

  if (!existJob) {
    throw new ApiError(401, "No Job Opening Exist");
  }

  if (existJob.organizationId.toString() != req.user._id.toString()) {
    throw new ApiError(401, "UnAuthorized");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    existJob._id,
    {
      title,
      description,
      requiredSkills,
      experience,
      applicationStartDate,
      applicationDeadline,
      interviewConfig: {
        duration: interviewDuration,
        bufferTime,
        environmentId,
      },
      ...(interviewMode && { interviewMode }),
      ...(availabilityType && { availabilityType }),
      ...(compensation && { compensation }),
      ...(status && { status }),
    },
    { new: true },
  );

  if (!updatedJob) {
    throw new ApiError(401, "Server Error");
  }

  return res.status(200).json(new ApiResponse(200, "Updated", updatedJob));
});

export const deleteJobOpening = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(401, "Invalid Id");
  }

  const existJob = await Job.findById(id);
  if (!existJob) {
    throw new ApiError(401, "No Job Opening Exists");
  }

  if (existJob.organizationId.toString() != req.user._id.toString()) {
    throw new ApiError(403, "UnAuthorized");
  }

  const deletedJob = await Job.findByIdAndDelete(existJob._id);

  return res.status(200).json(new ApiResponse(200, "Deleted Job", deletedJob));
});

export const changeStatusOfJobOpening = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;
  if (!id) {
    throw new ApiError(401, "Invalid Id");
  }
  if (!status) {
    throw new ApiError(401, "Invalid Status");
  }

  const existJob = await Job.findById(id);

  if (!existJob) {
    throw new ApiError(401, "No Job Opening Exist");
  }

  const isOwner = existJob.organizationId.toString() == req.user._id.toString();
  if (!isOwner) {
    throw new ApiError(403, "UnAuthorized");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    existJob._id,
    {
      status,
    },
    { new: true },
  );

  if (!updatedJob) {
    throw new ApiError(500, "Server Issue");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Status Updated.", updatedJob));
});
