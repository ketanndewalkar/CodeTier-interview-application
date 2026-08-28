import toast from "react-hot-toast";
import { INTERVIEW_EVENTS } from "../../utils/constants";
import { useRoomStore } from "../../store/room.store";

export const interviewSocketHandler = (data) => {
    const event = data.event;
    const { isEnterRoom, setIsEnterRoom } = useRoomStore.getState();
    switch (event) {
        case INTERVIEW_EVENTS.PARTICIPANT_JOINED:
            if (isEnterRoom) {
                toast.success(data.payload.username + " has joined the room");
            }
            break;
        case INTERVIEW_EVENTS.LEAVE_ROOM:

            break;
        case INTERVIEW_EVENTS.JOIN_ROOM_ACK:
            setIsEnterRoom(true);
            break;
        default:
            console.warn(`Unhandled interview event: ${event}`);
    }
}