import mongoose from "mongoose";

const recurringSlotSchema = new mongoose.Schema(
    {
        day: {
            type: String,
            enum: [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY",
            ],
            required: true,
        },
        startTime: {
            type: String,//09:30
            required: true,
        },
        endTime: {
            type: String,//06:25
            required: true,
        },
    },
    {
        _id: false,
    }
);

const blockedSlotSchema = new mongoose.Schema({
    start: Date,
    end: Date,
    reason: String,
});

const interviewerAvailabilitySchema = new mongoose.Schema(
    {
        interviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            unique: true,
            required: true,
        },

        timezone: {
            type: String,
            default: "Asia/Kolkata",
        },

        recurringAvailability: [recurringSlotSchema],

        blockedSlots: [blockedSlotSchema],
    },
    {
        timestamps: true,
    }
);

export const InterviewerAvailability = mongoose.model(
    "InterviewerAvailability",
    interviewerAvailabilitySchema
);