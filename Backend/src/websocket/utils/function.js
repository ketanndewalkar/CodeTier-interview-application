import { getRoom } from "../rooms/room.manager.js";
import { Interview } from "../../models/interview.model.js";

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



export const startInterview = async ({
  interviewId,
  interviewerId
}) => {


  const interview =
    await Interview.findById(interviewId);



  if (!interview) {

    throw new Error(
      "Interview not found"
    );

  }



  // Permission check

  if (
    interview.interviewerId.toString()
    !== interviewerId.toString()
  ) {

    throw new Error(
      "You are not allowed to start this interview"
    );

  }



  // Prevent restarting

  // if (
  //   interview.status === "IN_PROGRESS"
  // ) {

  //   throw new Error(
  //     "Interview already started"
  //   );

  // }



  if (
    interview.status === "COMPLETED"
  ) {

    throw new Error(
      "Interview already completed"
    );

  }



  interview.status = "IN_PROGRESS";

  interview.startedAt = new Date();



  await interview.save();



  return interview;

};