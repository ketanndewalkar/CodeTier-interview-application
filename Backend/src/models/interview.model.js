import mongoose from 'mongoose';
const { Schema } = mongoose;

/**
 * Not part of the originally supplied schema doc, but required because
 * JobApplication.interviewId references it. Kept minimal and consistent
 * with the naming/style of the other models.
 */
const InterviewSchema = new Schema(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'JobApplication', required: true, unique: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    interviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true }, // minutes, snapshot from JobOpening
    status: {
      type: String,
      enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'],
      default: 'SCHEDULED',
    },
    environmentId: {
        type: Schema.Types.ObjectId,
        ref: "Environment",
        required: true
    },
    // Audit trail: why this interviewer/slot won, for debugging & admin UI.
    scoringSnapshot: {
      totalScore: { type: Number },
      breakdown: { type: Schema.Types.Mixed },
      rankedAlternatives: [
        {
          interviewerId: { type: Schema.Types.ObjectId, ref: 'User' },
          totalScore: { type: Number },
        },
      ],
    },
  },
  { timestamps: true }
);

// The single most important index for conflict-checking: overlap queries
// on a given interviewer within a time range.
InterviewSchema.index({ interviewerId: 1, startTime: 1, endTime: 1 });
InterviewSchema.index({ organizationId: 1, status: 1 });

// Prevents two ACTIVE interviews from ever sharing the exact same
// (interviewerId, startTime) pair at the DB layer as a last-resort guard.
// This is a supplement to, not a replacement for, the overlap check done
// in application code (identical startTime is a narrower case than overlap).
InterviewSchema.index(
  { interviewerId: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['SCHEDULED', 'IN_PROGRESS'] } },
  }
);

export const Interview = mongoose.model('Interview', InterviewSchema);
