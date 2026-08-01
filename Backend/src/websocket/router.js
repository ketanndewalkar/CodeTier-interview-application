import { SOCKET_NAMESPACE } from "./constants.js";

import { interviewHandler } from "./handlers/interview.handler.js";

export function socketRouter(socket) {
  socket.on("message", (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString());
      console.log(message);
      switch (message.namespace) {
        case SOCKET_NAMESPACE.INTERVIEW:
          interviewHandler(socket, message);
          break;

        default:
          console.log("Unknown namespace", message.namespace);
      }
    } catch (error) {
      console.log("Invalid socket message", error);
    }
  });
}
