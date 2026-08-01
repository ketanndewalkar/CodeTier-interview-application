import { Job } from "../models/job.model.js";
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

  return res
    .status(200)
    .json(new ApiResponse(200, "Job Successfully fetched", jobs));
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
    !environmentId
  ) {
    throw new ApiError(401, "All Fields are required");
  }

  const existJob = await Job.findOne({
    title,
    description,
    requiredSkills,
    experience,
    applicationStartDate,
    applicationDeadline,
    interviewDuration,
    bufferTime,
    environmentId,
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
  //   TODO:for candidate check if already applied for job and
  //        send a isApplied attribute in the job object send as response
  console.log(job)
  if (!job) {
    throw new ApiError(401, "Job Opening dont Exist");
  }

  return res.status(200).json(new ApiResponse(200, "Job Opening Fetched", job));
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
  } = req.body;

  if (!id) {
    throw new ApiError(401, "Unique Key is required");
  }
  const existJob = await Job.findById(id);

  if (existJob.organizationId.toString() != req.user._id.toString()) {
    throw new ApiError(401, "UnAuthorized");
  }
  if (!existJob) {
    throw new ApiError(401, "No Job Opening Exist");
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
