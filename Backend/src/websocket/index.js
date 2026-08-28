import { WebSocketServer } from "ws";
import { socketRouter } from "./router.js";
import crypto from "crypto";
import { auth } from "./utils/authentication.socket.js";
import { getConnection, removeConnection, removeUserSocket } from "./handlers/connection.manager.js";
import { removeParticipant, getRoom } from "./rooms/room.manager.js";
import { getParticipants } from "./utils/function.js";
import { broadcastToRoom } from "./utils/broadcaster.js";
import { SOCKET_NAMESPACE, INTERVIEW_EVENTS } from "./constants.js";
import { cleanupSocketStream } from "./handlers/terminal.handler.js";

export async function setupWebSocket(server) {
  const wss = new WebSocketServer({
    server,
  });

  wss.on("connection", async (socket, request) => {
    socket.id = crypto.randomUUID();

    console.log("Socket connected", socket.id);

    await auth(socket, request);

    socketRouter(socket);

    socket.on("close", () => {
      cleanupSocketStream(socket.id);
      const connection = getConnection(socket.id);

      if (connection) {
        const { roomId, userId } = connection;

        // Clean up from room manager and connection manager
        removeParticipant(roomId, userId);
        removeConnection(socket.id);

        // Notify remaining participants in the room
        const room = getRoom(roomId);
        if (room) {
          const { participants } = getParticipants(roomId);
          broadcastToRoom(
            roomId,
            {
              namespace: SOCKET_NAMESPACE.INTERVIEW,
              event: INTERVIEW_EVENTS.PARTICIPANT_LEFT,
              payload: {
                userId,
                room: {
                  ...room,
                  participants,
                },
              },
            }
          );
        }
      }

      if (socket.user) {
        removeUserSocket(socket.user._id.toString());
      }

      console.log("Socket disconnected", socket.id);
    });
  });
}
