import { WebSocketServer } from "ws";

import { socketRouter } from "./router.js";

import crypto from "crypto";

import { auth } from "./utils/authentication.socket.js";
import { getConnection } from "./handlers/connection.manager.js";

export async function setupWebSocket (server) {
  const wss = new WebSocketServer({
    server,
  });

  wss.on("connection", (socket,request) => {
    socket.id = crypto.randomUUID();

    console.log("Socket connected", socket.id);

    auth(socket,request)

    socketRouter(socket);

    socket.on("close", () => {
      const connection = getConnection(socket.id);

      console.log("Socket disconnected", connection);
    });
  });
}
