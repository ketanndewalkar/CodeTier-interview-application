import mongoose, { Schema } from "mongoose";

const jobApplicationSchema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    jobOpeningId: {
      type: Schema.Types.ObjectId,
      ref: "JobOpening",
      required: true,
    },

    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },

    coverLetter: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },

    portfolioLinks: [
      {
        platform: {
          type: String,
          enum: [
            "GITHUB",
            "LINKEDIN",
            "PORTFOLIO",
            "LEETCODE",
            "CODEFORCES",
            "CODECHEF",
            "HACKERRANK",
            "OTHER",
          ],
          required: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
    },

    expectedSalary: {
      type: Number,
      min: 0,
      default: null,
    },

    noticePeriod: {
      type: Number, // in days
      min: 0,
      default: 0,
    },

    currentLocation: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    applicationStatus: {
      type: String,
      enum: [
        "APPLIED",
        "SHORTLISTED",
        "REJECTED",
        "HIRED",
      ],
      default: "APPLIED",
      required: true,
    },

    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

// A candidate can apply only once to a particular job
jobApplicationSchema.index(
  {
    candidateId: 1,
    jobOpeningId: 1,
  },
  {
    unique: true,
  }
);

// Helpful for organizations while listing applications of a job
jobApplicationSchema.index({
  organizationId: 1,
  jobOpeningId: 1,
  applicationStatus: 1,
});

export const Application = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);