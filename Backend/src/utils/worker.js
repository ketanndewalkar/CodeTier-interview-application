import "dotenv/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { setupInterviewEnvironment } from "../services/InterviewEnvironment/setupInterviewEnvironment.js";
import { mongoDBConnect } from "../db/db.js";
import { InterviewEnvironment } from "../models/environment.model.js";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

try {
  await mongoDBConnect();
  console.log("MongoDB connected for worker");
} catch (err) {
  console.error("Failed to connect to MongoDB in worker:", err);
  process.exit(1);
}

const worker = new Worker(
  "interview-queue",
  async (job) => {
    console.log("job starts", job.id, job.name);
    try {
      const result = await setupInterviewEnvironment(job.data.interviewId);
      return result;
    } catch (err) {
      const interviewEnvironment = await InterviewEnvironment.findOneAndUpdate({
        interviewId
      },{
        status:"FAILED"
      },{
        new:true
      })
      throw err;
    }
  },
  {
    connection,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  if(job.attemptsMade === job.opts.attempts){
        await InterviewEnvironment.findOneAndUpdate(
          {
            interviewId: job.data.interviewId
          },
          {
            status:"FAILED"
          }
        )
    }
});

const shutdown = async () => {
  console.log("Shutting down worker...");
  try {
    await worker.close();
    connection.disconnect();
  } catch (err) {
    console.error("Error during shutdown:", err);
  }
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log("Worker Started...");
