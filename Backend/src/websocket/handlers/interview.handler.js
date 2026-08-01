import {
  addParticipant,
  removeParticipant,
  getRoomSize,
  getRoom,
} from "../rooms/room.manager.js";

import { addConnection, removeConnection } from "./connection.manager.js";

import { broadcastToRoom } from "../utils/broadcaster.js";
import {
  INTERVIEW_EVENTS,
  ROOM_STATUS,
  SOCKET_NAMESPACE,
} from "../constants.js";
import { getParticipants } from "../utils/function.js";

export function interviewHandler(socket, message) {
  switch (message.event) {
    case INTERVIEW_EVENTS.JOIN_ROOM:
      joinRoom(socket, message);

      break;

    case INTERVIEW_EVENTS.LEAVE_ROOM:
      leaveRoom(socket, message);

      break;
    case INTERVIEW_EVENTS.INTERVIEW_LIVE:
      interviewLive(socket, message);
      break;
    default:
      console.log("Unknown interview event");
  }
}

function joinRoom(socket, message) {
  const { roomId, interviewId } = message.payload;
  const { _id, name, role } = socket.user;
  console.log(_id.toString());
  const participant = {
    userId: _id,
    role,
    socketId: socket.id,
    socket,
    roomId,
  };

  addParticipant(roomId, participant);

  addConnection(socket.id, {
    userId: _id,
    roomId,
  });

  const { room, participants } = getParticipants(roomId);
  broadcastToRoom(
    roomId,

    {
      namespace: SOCKET_NAMESPACE.INTERVIEW,

      event: INTERVIEW_EVENTS.PARTICIPANT_JOINED,

      payload: {
        userId: _id,
        username: name,
        role,
        room: {
          ...room,
          participants,
        },
      },
    },

    _id.toString(),
  );

  if (getRoomSize(roomId) === 2) {
    const room = getRoom(roomId);
    room.status = ROOM_STATUS.READY;
    broadcastToRoom(
      roomId,

      {
        namespace: SOCKET_NAMESPACE.INTERVIEW,

        event: INTERVIEW_EVENTS.INTERVIEW_READY,

        payload: {
          room: {
            ...room,
            participants,
          },
        },
      },
    );
  }
}

function leaveRoom(socket, message) {
  const { roomId } = message.payload;
  removeParticipant(roomId, socket.user._id);

  removeConnection(socket.id);
  const { room, participants } = getParticipants(roomId);
  broadcastToRoom(
    roomId,

    {
      namespace: SOCKET_NAMESPACE.INTERVIEW,

      event: INTERVIEW_EVENTS.PARTICIPANT_LEFT,

      payload: {
        userId: socket.user._id,
        username: socket.user.name,
        room: {
          ...room,
          participants,
        },
      },
    },
  );
}

function interviewLive(socket, message) {
  const { roomId } = message.payload;

  const { room, participants } = getParticipants(roomId);
  room.status = ROOM_STATUS.LIVE;
  broadcastToRoom(roomId, {
    namespace: SOCKET_NAMESPACE.INTERVIEW,
    event: INTERVIEW_EVENTS.INTERVIEW_LIVE,
    payload: {
      roomId,
      room: {
        ...room,
        participants,
      },
    },
  });
}
