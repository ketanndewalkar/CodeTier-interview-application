import { startInterview } from "../utils/function.js";
import {
  addParticipant,
  removeParticipant,
  getRoomSize,
  getRoom,
  getParticipant,
} from "../rooms/room.manager.js";

import { addConnection, addUserSocket, removeConnection, sendToUser } from "./connection.manager.js";

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
      handleStartInterview({ socket, data: message });
      break;

    default:
      console.log("Unknown interview event");
  }
}

function joinRoom(socket, message) {
  const { roomId } = message.payload;
  console.log(socket.user, "hello")
  const { _id, name, role } = socket.user;
  const participant = {
    userId: _id,
    name,
    role,
    socketId: socket.id,
    socket,
    roomId,
  };

  addParticipant(roomId, participant);
  addUserSocket(_id, socket);
  addConnection(socket.id, {
    userId: _id,
    roomId,
  });

  const { room, participants } = getParticipants(roomId);

  //Room Joined Acknowledgement
  sendToUser(_id.toString(), {
    namespace: SOCKET_NAMESPACE.INTERVIEW,
    event: INTERVIEW_EVENTS.JOIN_ROOM_ACK,
    payload: {
      userId: _id,
      roomId,
      room: {
        ...room,
        participants
      },
    },
  });


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
  if (participants.length === 1) {
    room.status = ROOM_STATUS.WAITING;
  }
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



export const handleStartInterview = async ({
  socket,
  data,
}) => {

  const {
    interviewId,
    roomId
  } = data.payload;


  try {

    const user = getParticipant(
      roomId,
      socket.user._id
    );

    if (!user) {
      socket.send(JSON.stringify({
        type: "ERROR",
        message: "User not found in room"
      }));

      return;
    }


    // Only interviewer can start
    if (user.role !== "INTERVIEWER") {

      socket.send(JSON.stringify({
        type: "ERROR",
        message: "Only interviewer can start interview"
      }));

      return;
    }



    // Update database
    const interview =
      await startInterview({
        interviewId,
        interviewerId: user.userId
      });



    // Update in-memory room state

    const { room, participants } = getParticipants(roomId);
    room.status = "LIVE";


    // Notify everyone inside room

    broadcastToRoom(
      roomId,
      {
        namespace: SOCKET_NAMESPACE.INTERVIEW,
        event: INTERVIEW_EVENTS.INTERVIEW_LIVE,
        payload: {
          ...room, participants,
          interviewId,
          startedAt: interview.startedAt
        }
      }
    );


  } catch (error) {

    socket.send(JSON.stringify({
      type: "ERROR",
      message: error.message
    }));

  }

};

