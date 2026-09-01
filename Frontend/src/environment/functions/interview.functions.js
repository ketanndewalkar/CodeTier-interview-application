import { api } from "../../services/api/axiosInstance"
import { useRoomStore } from "../../store/room.store";



export const fetchInterviewDetails = async (params) => {
    try {
        const result = await api.get(`/interview/interview/${params.queryKey[1]}`);
        return result.data.data
    } catch (error) {
        throw error
    }
}

export const fetchInterviewRoom = async (interviewId) => {
    try {
        const res = await api.get(`/interview/${interviewId}/join`)
        return res.data.data
    } catch (error) {
        throw error
    }

}

export const fetchRoomDetails = async (interviewId, roomId) => {
    try {
        const res = await api.get(`/interview/interview/${interviewId}/room/${roomId}`)
        useRoomStore.getState().setRoom(res.data.data)
        useRoomStore.getState().setRoomId(res.data.data.roomId)
        useRoomStore.getState().setStatus(res.data.data.status)
    }
    catch (error) {
        throw error
    }
}

export const submitInterviewEvaluation = async ({ interviewId, data }) => {
    try {
        const res = await api.post(`/interview/${interviewId}/evaluate`, data);
        return res.data;
    } catch (error) {
        throw error;
    }
};