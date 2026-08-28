import docker from "../../config/docker.js";
import { InterviewEnvironment } from "../../models/environment.model.js";

// Maps socket.id to active terminal stream and exec instance
const activeStreams = new Map();

export const terminalHandler = async (socket, message) => {
  const { event, payload } = message;

  switch (event) {
    case "INIT": {
      const { interviewId } = payload || {};
      if (!interviewId) return;

      try {
        const env = await InterviewEnvironment.findOne({ interviewId });
        if (!env || !env.containerId) {
          socket.send(JSON.stringify({
            namespace: "TERMINAL",
            event: "ERROR",
            payload: { message: "Interview environment not running" }
          }));
          return;
        }

        const container = docker.getContainer(env.containerId);

        // Check if there is an existing stream for this socket and clean it up
        cleanupSocketStream(socket.id);

        // Create shell execution
        const exec = await container.exec({
          Cmd: ["/bin/sh"], // fallback shell
          AttachStdin: true,
          AttachStdout: true,
          AttachStderr: true,
          Tty: true
        });

        const stream = await exec.start({
          stdin: true,
          hijack: true
        });

        // Store the stream and exec reference
        activeStreams.set(socket.id, { stream, exec });

        // Listen for output from the docker container exec session
        stream.on("data", (chunk) => {
          if (socket.readyState === 1) { // OPEN
            socket.send(JSON.stringify({
              namespace: "TERMINAL",
              event: "OUTPUT",
              payload: { text: chunk.toString("utf-8") }
            }));
          }
        });

        stream.on("end", () => {
          cleanupSocketStream(socket.id);
        });

        stream.on("error", (err) => {
          console.error("Docker terminal stream error:", err);
          cleanupSocketStream(socket.id);
        });

        // Send ready acknowledgment
        socket.send(JSON.stringify({
          namespace: "TERMINAL",
          event: "READY"
        }));

      } catch (error) {
        console.error("Failed to initialize terminal session:", error);
        socket.send(JSON.stringify({
          namespace: "TERMINAL",
          event: "ERROR",
          payload: { message: "Failed to initialize terminal: " + error.message }
        }));
      }
      break;
    }

    case "INPUT": {
      const { text } = payload || {};
      const session = activeStreams.get(socket.id);
      if (session && session.stream) {
        session.stream.write(text);
      }
      break;
    }

    case "RESIZE": {
      const { cols, rows } = payload || {};
      const session = activeStreams.get(socket.id);
      if (session && session.exec && cols && rows) {
        try {
          await session.exec.resize({ w: cols, h: rows });
        } catch (err) {
          // ignore resize errors (e.g. if process exited)
        }
      }
      break;
    }

    default:
      console.warn("Unknown terminal event:", event);
  }
};

export const cleanupSocketStream = (socketId) => {
  const session = activeStreams.get(socketId);
  if (session) {
    try {
      if (session.stream) {
        session.stream.end();
      }
    } catch (err) {
      // ignore
    }
    activeStreams.delete(socketId);
  }
};
