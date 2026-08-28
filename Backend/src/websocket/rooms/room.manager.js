// websocket/managers/room.manager.js
import { INTERVIEW_EVENTS, ROOM_STATUS } from "../constants.js";

export const rooms = new Map();

export function createRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      roomId,
      participants: new Map(),
      status: ROOM_STATUS.WAITING
    });
  }
  return rooms.get(roomId);
}

export function addParticipant(roomId, participant) {
  const room = createRoom(roomId);

  room.participants.set(participant.userId, participant);
  console.log(room)
}

export function removeParticipant(roomId, userId) {
  const room = rooms.get(roomId);

  if (!room) return;

  room.participants.delete(userId);

  if (room.participants.size === 0) {
    rooms.delete(roomId);
  }
}

export function getRoom(roomId) {
  return rooms.get(roomId);
}

export function getParticipants(roomId) {
  const room = rooms.get(roomId);

  if (!room) return [];

  return Array.from(room.participants.values());
}

export function getParticipant(roomId, userId) {
  const room = rooms.get(roomId);

  if (!room) return null;

  return room.participants.get(userId);
}

export function getRoomSize(roomId) {
  const room = rooms.get(roomId);

  if (!room) return 0;

  return room.participants.size;
}

export function removeRoom(roomId) {
  if (rooms.delete(roomId)) {
    return true;
  }
  return false;
}