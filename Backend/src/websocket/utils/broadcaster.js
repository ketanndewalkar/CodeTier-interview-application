import { getParticipants } from "../rooms/room.manager.js";


export function broadcastToRoom(roomId, message, excludeUserId = null) {
  const participants = getParticipants(roomId);

  participants.forEach((participant) => {
    if (participant.userId !== excludeUserId) {
      participant.socket.send(JSON.stringify(message));
    }
  });
}
