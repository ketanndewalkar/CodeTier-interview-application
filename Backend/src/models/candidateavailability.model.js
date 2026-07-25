import mongoose from 'mongoose';
const { Schema } = mongoose;

const CandidateAvailabilitySchema = new Schema(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'JobApplication', required: true, unique: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timezone: { type: String, default: 'Asia/Calcutta' },
    slots: [
      {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const CandidateAvailability = mongoose.model('CandidateAvailability', CandidateAvailabilitySchema);
