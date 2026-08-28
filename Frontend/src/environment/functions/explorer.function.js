import { api } from "../../services/api/axiosInstance"

export const fetchinterviewWorkspace = async (interviewId) => {
    try {
        const res = await api.get(`interview/interview/${interviewId}/workspace`)
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

export const createWorkspaceEntity = async (interviewId, path, type) => {
    try {
        const res = await api.post(`/interview/interview/${interviewId}/workspace`, { path, type });
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

export const deleteWorkspaceEntity = async (interviewId, path) => {
    try {
        const res = await api.delete(`/interview/interview/${interviewId}/workspace`, {
            params: { path }
        });
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

export const renameWorkspaceEntity = async (interviewId, oldPath, newPath) => {
    try {
        const res = await api.put(`/interview/interview/${interviewId}/workspace/rename`, { oldPath, newPath });
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

export const fetchWorkspaceFile = async (interviewId, path) => {
    try {
        const res = await api.get(`/interview/interview/${interviewId}/workspace/file`, {
            params: { path }
        });
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

export const updateWorkspaceFile = async (interviewId, path, content) => {
    try {
        const res = await api.put(`/interview/interview/${interviewId}/workspace/file`, { path, content });
        return res.data.data;
    } catch (error) {
        throw error;
    }
}

export const fetchInterviewEnvironment = async (interviewId) => {
    try {
        const res = await api.get(`/interview/interview/${interviewId}/environment`);
        return res.data.data;
    } catch (error) {
        throw error;
    }
}