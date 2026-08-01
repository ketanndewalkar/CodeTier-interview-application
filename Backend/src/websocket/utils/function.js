import { getRoom } from "../rooms/room.manager.js";

export function updateRoomStatus(room) {
  const hasInterviewer = room.participants.some(
    ({ role }) => role === USER_ROLE.INTERVIEWER,
  );

  room.status = hasInterviewer ? ROOM_STATUS.READY : ROOM_STATUS.WAITING;

  return room.status;
}

export const getParticipants = (roomId) => {
  const room = getRoom(roomId);

  const participants = [...room.participants.values()].map(
    ({ socket, ...participant }) => participant,
  );
  return { room, participants };
};
