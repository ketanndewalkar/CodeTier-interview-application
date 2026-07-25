import { Application } from "../models/application.model.js";
import { CandidateAvailability } from "../models/candidateavailability.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitAvailability = asyncHandler(async (req, res) => {
    const {timezone, slots } = req.body;
    const {id:applicationId} = req.params;
    if (!applicationId || !slots || slots.length === 0) {
        throw new ApiError(400, "Application and slots are required.");
    }

    const application = await Application.findOne({
        _id: applicationId,
        candidateId: req.user._id,
    });

    if (!application) {
        throw new ApiError(404, "Application not found.");
    }

    if (application.applicationStatus !== "SHORTLISTED") {
        throw new ApiError(
            400,
            "Availability can only be submitted for shortlisted applications."
        );
    }

    const availability = await CandidateAvailability.findOneAndUpdate(
        {
            applicationId,
        },
        {
            candidateId: req.user._id,
            timezone,
            slots,
        },
        {
            upsert: true,
            new: true,
            runValidators: true,
        }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, availability, "Availability submitted.", availability ));
});

export const getAvailability = asyncHandler(async (req, res) => {
    const { id:applicationId } = req.params;

    const availability = await CandidateAvailability.findOne({
        applicationId,
        candidateId: req.user._id,
    });

    if (!availability) {
        throw new ApiError(404, "Availability not found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, availability, "Availability fetched."));
});

export const updateAvailability = asyncHandler(async (req, res) => {
    const { id:applicationId } = req.params;
    const { timezone, slots } = req.body;

    const application = await JobApplication.findOne({
        _id: applicationId,
        candidateId: req.user._id,
    });

    if (!application) {
        throw new ApiError(404, "Application not found.");
    }

    if (application.interviewId) {
        throw new ApiError(
            400,
            "Availability cannot be updated after interview scheduling."
        );
    }

    const availability = await CandidateAvailability.findOneAndUpdate(
        {
            applicationId,
            candidateId: req.user._id,
        },
        {
            timezone,
            slots,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!availability) {
        throw new ApiError(404, "Availability not found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, availability, "Availability updated."));
});

export const deleteAvailability = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    const application = await JobApplication.findOne({
        _id: applicationId,
        candidateId: req.user._id,
    });

    if (!application) {
        throw new ApiError(404, "Application not found.");
    }

    if (application.interviewId) {
        throw new ApiError(
            400,
            "Availability cannot be deleted after interview scheduling."
        );
    }

    const availability = await CandidateAvailability.findOneAndDelete({
        applicationId,
        candidateId: req.user._id,
    });

    if (!availability) {
        throw new ApiError(404, "Availability not found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Availability deleted."));
});