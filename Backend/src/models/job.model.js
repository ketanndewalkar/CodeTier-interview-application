import mongoose, { Schema } from "mongoose";

const jobOpeningSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requiredSkills: {
      type: [String],
      required: true,
      default: [],
    },

    experience: {
      type: String,
      enum: ["FRESHER", "JUNIOR", "MID_LEVEL", "SENIOR", "LEAD", "PRINCIPAL"],
      required: true,
    },

    applicationStartDate: {
      type: Date,
      required: true,
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    // Interview Configuration
    interviewConfig: {
      duration: {
        type: Number,
        required: true,
        min: 15,
        default: 60, // minutes
      },

      bufferTime: {
        type: Number,
        default: 15, // minutes between interviews
        min: 0,
      },
      environmentId: {
            type: Schema.Types.ObjectId,
            ref: "Environment",
            required: true
        },
    },

    // Interview Mode
    interviewMode: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "HYBRID"],
      required: true,
      default: "ONLINE",
    },

    // Availability / Employment Type
    availabilityType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT", "FREELANCE"],
      required: true,
      default: "FULL_TIME",
    },

    // Compensation (Salary / Stipend)
    compensation: {
      amount: {
        type: Number,
        min: 0,
        default: null,
      },
      type: {
        type: String,
        enum: ["SALARY", "STIPEND"],
        default: "SALARY",
      },
      currency: {
        type: String,
        enum: ["INR", "USD", "EUR", "GBP"],
        default: "INR",
      },
      period: {
        type: String,
        enum: ["MONTHLY", "ANNUALLY", "LUMP_SUM"],
        default: "MONTHLY",
      },
    },

    status: {
      type: String,
      enum: ["DRAFT", "OPEN", "PAUSED", "CLOSED", "ARCHIVED"],
      default: "DRAFT",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("JobOpening", jobOpeningSchema);