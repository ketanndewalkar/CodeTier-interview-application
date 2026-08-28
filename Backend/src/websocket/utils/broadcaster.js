import { getParticipants } from "../rooms/room.manager.js";


export function broadcastToRoom(roomId, message, excludeUserId = null) {
  const participants = getParticipants(roomId);
  
  participants.forEach((participant) => {
    console.log(participant.userId.toString()," ", excludeUserId)
    if (participant.userId.toString() !== excludeUserId) {
      participant.socket.send(JSON.stringify(message));
    }
  });
}
