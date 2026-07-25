import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
    {
        start: {
            type: Date,
            required: true,
        },

        end: {
            type: Date,
            required: true,
        },
    },
    {
        _id: false,
    }
);

export { slotSchema };