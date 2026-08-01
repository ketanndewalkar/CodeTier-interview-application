import mongoose from "mongoose";
const environmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    language: {
      type: String,
      enum: ["REACT", "NODE", "JAVA", "CPP", "C", "PYTHON"],
      required: true,
    },
    dockerImage: {
      type: String,
      required: true,
    },
    workspaceTemplate: {
      type: String,
      required: true,
    },
    supportsPreview: {
      type: Boolean,
      default: false,
    },
    previewPort: {
      type: Number,
      default: null,
    },
    compileCommand: [String],
    runCommand: [String],
    containerStartCommand: [String],
    cpuLimit: {
      type: String,
      default: "1",
    },
    memoryLimit: {
      type: String,
      default: "512m",
    },
    timeoutSeconds: {
      type: Number,
      default: 300,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const interviewEnvironmentSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      unique: true,
    },
    environmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Environment",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PROVISIONING",
        "READY",
        "RUNNING",
        "STOPPED",
        "FAILED",
        "DESTROYED",
      ],
      default: "PROVISIONING",
    },
    containerId: String,
    roomId: String,
    workspacePath: String,
    info: {
      host: String,
      hostPort: Number,
      containerPort: Number,
      url: String,
    },
    startedAt: Date,
    destroyedAt: Date,
  },
  {
    timestamps: true,
  },
);

export const InterviewEnvironment = mongoose.model(
  "interviewenvironment",
  interviewEnvironmentSchema,
);
export const Environment = mongoose.model("environment", environmentSchema);
