import "dotenv/config";

import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { mongoDBConnect } from "./src/db/db.js";
import { authRoutes } from "./src/routes/auth.route.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import fs from "node:fs/promises";
import { Job } from "./src/models/job.model.js";
import { jobRoutes } from "./src/routes/job.route.js";
import { ApplicationRoutes } from "./src/routes/application.route.js";
import { AvailabilityRoutes } from "./src/routes/availability.route.js";
import { slotRoutes } from "./src/routes/slot.routes.js";
import { ApiResponse } from "./src/utils/apiResponse.js";
import schedulingService from "./src/services/schedulingService.js";
import { interviewQueue } from "./src/utils/queue.js";
import { interviewRoutes } from "./src/routes/interview.routes.js";
import { dashboardRoutes } from "./src/routes/dashboard.route.js";
import { setupWebSocket } from "./src/websocket/index.js";
import { environmentRoutes } from "./src/routes/environment.route.js";
const app = express();

// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/application", ApplicationRoutes)
app.use("/api/v1/availability", AvailabilityRoutes)
app.use("/api/v1/slot", slotRoutes)
app.use("/api/v1/interview", interviewRoutes)
app.use("/api/v1/dashboard", dashboardRoutes)
app.use("/api/v1/environment", environmentRoutes)

// PORT intialization
const PORT = process.env.PORT || 8080;

// http server creation
export const server = createServer(app);

// setup Web Socket
await setupWebSocket(server)
  .then(async () => {
    await mongoDBConnect()
      .then(async () => {
        server.listen(PORT, () => {
          console.log("MONGODB CONNECTED ✅");
          console.log(`Listening on http://localhost:${PORT}`);
          console.log(`WEBSOCKET on ws://localhost:${PORT}`);
        });
      })
      .catch((err) => console.log("Error Message:", err));
  })
  .catch((err) => console.log(err.message));

app.use(errorHandler);


