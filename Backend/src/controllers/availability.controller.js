import { InterviewerAvailability } from "../models/availability.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createAvailability = asyncHandler(async (req, res) => {
    const { timezone, recurringAvailability } = req.body;

    if (!recurringAvailability || recurringAvailability.length === 0) {
        throw new ApiError(400, "Recurring availability is required.");
    }

    const existingAvailability = await InterviewerAvailability.findOne({
        interviewerId: req.user._id,
    });

    if (existingAvailability) {
        throw new ApiError(
            409,
            "Availability already exists. Please update it instead."
        );
    }

    const availability = await InterviewerAvailability.create({
        interviewerId: req.user._id,
        timezone,
        recurringAvailability,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, availability, "Availability created."));
});

export const getAvailability = asyncHandler(async (req, res) => {
    const availability = await InterviewerAvailability.findOne({
        interviewerId: req.user._id,
    });

    if (!availability) {
        throw new ApiError(404, "Availability not found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, availability, "Availability fetched."));
});

export const updateAvailability = asyncHandler(async (req, res) => {
    const { timezone, recurringAvailability } = req.body;

    if (!recurringAvailability || recurringAvailability.length === 0) {
        throw new ApiError(400, "Recurring availability is required.");
    }

    const availability = await InterviewerAvailability.findOneAndUpdate(
        {
            interviewerId: req.user._id,
        },
        {
            timezone,
            recurringAvailability,
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

export const addBlock = asyncHandler(async (req, res) => {
    const { start, end, reason } = req.body;

    if (!start || !end) {
        throw new ApiError(400, "Start and end time are required.");
    }

    const availability = await InterviewerAvailability.findOne({
        interviewerId: req.user._id,
    });

    if (!availability) {
        throw new ApiError(404, "Availability not found.");
    }

    availability.blockedSlots.push({
        start,
        end,
        reason,
    });

    await availability.save();

    return res
        .status(200)
        .json(new ApiResponse(200, availability, "Blocked slot added."));
});

export const removeBlock = asyncHandler(async (req, res) => {
    const { blockId } = req.params;

    const availability = await InterviewerAvailability.findOne({
        interviewerId: req.user._id,
    });

    if (!availability) {
        throw new ApiError(404, "Availability not found.");
    }

    availability.blockedSlots.pull(blockId);

    await availability.save();

    return res
        .status(200)
        .json(new ApiResponse(200, availability, "Blocked slot removed."));
});