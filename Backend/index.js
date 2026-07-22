import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { mongoDBConnect } from "./src/db/db.js";
import { authRoutes } from "./src/routes/auth.route.js";
import { setupWebSocket } from "./src/utils/ws.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import fs from "node:fs/promises";
import { Job } from "./src/models/job.model.js";
import { jobRoutes } from "./src/routes/job.route.js";
const app = express();

// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// Routes
app.get("/", (req, res) => res.send("health"));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/job",jobRoutes);
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


