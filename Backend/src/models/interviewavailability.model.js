const mongoose = require('mongoose');
const { Schema } = mongoose;

const InterviewerAvailabilitySchema = new Schema(
  {
    interviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    timezone: { type: String, default: 'Asia/Kolkata' },
    recurringAvailability: [
      {
        day: {
          type: String,
          enum: [
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
            'SUNDAY',
          ],
          required: true,
        },
        startTime: { type: String, required: true }, // "HH:mm" in interviewer's timezone
        endTime: { type: String, required: true },
      },
    ],
    blockedSlots: [
      {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        reason: { type: String },
      },
    ],
  },
  { timestamps: true }
);

InterviewerAvailabilitySchema.index({ 'blockedSlots.start': 1, 'blockedSlots.end': 1 });

export const InterviewerAvailability = mongoose.model('InterviewerAvailability', InterviewerAvailabilitySchema);
