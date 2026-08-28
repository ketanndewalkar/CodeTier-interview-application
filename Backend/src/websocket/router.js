import { SOCKET_NAMESPACE } from "./constants.js";

import { interviewHandler } from "./handlers/interview.handler.js";
import { RTCHandler } from "./handlers/rtc.handle.js";
import { terminalHandler } from "./handlers/terminal.handler.js";

export function socketRouter(socket) {
  socket.on("message", (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString());
      switch (message.namespace) {
        case SOCKET_NAMESPACE.INTERVIEW:
          interviewHandler(socket, message);
          break;
        case SOCKET_NAMESPACE.RTC:
          RTCHandler(socket, message);
          break;
        case SOCKET_NAMESPACE.TERMINAL:
          terminalHandler(socket, message);
          break;
        default:
          console.log("Unknown namespace", message.namespace);
      }
    } catch (error) {
      console.log("Invalid socket message", error);
    }
  });
}


