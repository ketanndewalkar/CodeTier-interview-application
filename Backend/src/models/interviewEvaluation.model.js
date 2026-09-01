import mongoose from "mongoose";

const interviewEvaluationSchema = new mongoose.Schema(
    {
        // Relationships
        interviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview",
            required: true,
            unique: true,
            index: true,
        },

        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        interviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // Overall assessment
        overallRating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        recommendation: {
            type: String,
            required: true,
            enum: [
                "STRONG_HIRE",
                "HIRE",
                "HOLD",
                "NO_HIRE",
                "STRONG_NO_HIRE",
            ],
        },

        interviewerConfidence: {
            type: Number,
            min: 1,
            max: 5,
        },

        // Technical evaluation
        technical: {
            problemSolving: {
                type: Number,
                min: 1,
                max: 5,
            },

            codingSkills: {
                type: Number,
                min: 1,
                max: 5,
            },

            dataStructuresAlgorithms: {
                type: Number,
                min: 1,
                max: 5,
            },

            technicalFundamentals: {
                type: Number,
                min: 1,
                max: 5,
            },

            systemDesign: {
                type: Number,
                min: 1,
                max: 5,
            },

            debuggingLogicalThinking: {
                type: Number,
                min: 1,
                max: 5,
            },
        },

        // Behavioral evaluation
        behavioral: {
            communication: {
                type: Number,
                min: 1,
                max: 5,
            },

            clarityOfThought: {
                type: Number,
                min: 1,
                max: 5,
            },

            confidence: {
                type: Number,
                min: 1,
                max: 5,
            },

            collaboration: {
                type: Number,
                min: 1,
                max: 5,
            },

            adaptability: {
                type: Number,
                min: 1,
                max: 5,
            },

            professionalism: {
                type: Number,
                min: 1,
                max: 5,
            },
        },

        // Qualitative feedback
        feedback: {
            strengths: {
                type: String,
                trim: true,
            },

            areasForImprovement: {
                type: String,
                trim: true,
            },

            keyObservations: {
                type: String,
                trim: true,
            },

            notableResponses: {
                type: String,
                trim: true,
            },
        },

        // Final decision
        finalDecision: {
            type: String,
            enum: [
                "SELECTED",
                "REJECTED",
                "FURTHER_ROUND",
            ],
            required: true,
        },

        finalReason: {
            type: String,
            required: true,
            trim: true,
        },

        additionalComments: {
            type: String,
            trim: true,
        },

        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const interviewEvaluation = mongoose.model(
    "InterviewEvaluation",
    interviewEvaluationSchema
);