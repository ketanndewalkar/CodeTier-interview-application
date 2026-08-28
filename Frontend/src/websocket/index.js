import { useRoomStore } from "../store/room.store";
import { SOCKET_NAMESPACE } from "../utils/constants";
import { interviewSocketHandler } from "./handler/interview.handler";
import { queryClient } from "../app/provider";

const setRoom = useRoomStore.getState().setRoom;
const setStatus = useRoomStore.getState().setStatus;
export const socketHandler = (data) => {
    const namespace = data.namespace;
    switch (namespace) {
        case SOCKET_NAMESPACE.INTERVIEW: {
            interviewSocketHandler(data);
            const room = data.payload?.room || data.payload;
            console.log(room)
            if (room) {
                setRoom(room);
                if (room.status) {
                    setStatus(room.status);
                }
            }
            break;
        }
        case SOCKET_NAMESPACE.WORKSPACE: {
            if (data.event === "TREE_UPDATED") {
                const { interviewId, dirInfo } = data.payload || {};
                if (interviewId && dirInfo) {
                    queryClient.setQueryData(["workspace", interviewId], dirInfo);
                }
            } else if (data.event === "FILE_UPDATED") {
                const { interviewId, path, content } = data.payload || {};
                if (interviewId && path && content !== undefined) {
                    queryClient.setQueryData(["file", interviewId, path], { path, content });
                }
            }
            break;
        }
        case SOCKET_NAMESPACE.TERMINAL: {
            if (data.event === "OUTPUT") {
                window.dispatchEvent(new CustomEvent("terminal-output", { detail: data.payload }));
            } else if (data.event === "READY") {
                window.dispatchEvent(new CustomEvent("terminal-ready"));
            } else if (data.event === "ERROR") {
                window.dispatchEvent(new CustomEvent("terminal-error", { detail: data.payload }));
            }
            break;
        }
        default:
            console.warn(`Unhandled namespace: ${namespace}`);
    }
}