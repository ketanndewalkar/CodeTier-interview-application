import { RTC_EVENTS, SOCKET_NAMESPACE } from "../constants.js";
import { socketResponse } from "../utils/socketResponse.js";
import { sendToUser } from "./connection.manager.js";

export const RTCHandler = (socket, message) => {
    switch (message.event) {
        case RTC_EVENTS.OFFER:
        case RTC_EVENTS.ANSWER:
        case RTC_EVENTS.ICE_CANDIDATE:
            const to = message.to;
            sendToUser(message.to, message)
            break;
        default:
            socket.send(JSON.stringify(new socketResponse(SOCKET_NAMESPACE.ERROR, null, null, null, { message: "EVENT NOT FOUND IN RTC" })))
    }
}