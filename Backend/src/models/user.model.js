import mongoose from "mongoose"
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: String,
    role: {
        type: String,
        enum: ["CANDIDATE", "INTERVIEWER", "ORGANIZATION"],
        default: "CANDIDATE"
    },
    skills: {
        type: [String],
    },
    experience: {
        type: Number,
        default: 0
    },
    timezone: String,
    availability: {
        type: [String],
    },
    refreshToken: String

}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next;
});

userSchema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

export const User = mongoose.model("user", userSchema);