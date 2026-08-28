import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useRoomStore } from '../../store/room.store';
import { fetchRoomDetails } from '../functions/interview.functions';
import { fetchInterviewEnvironment } from '../functions/explorer.function';

const useEnvironment = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const isEnterWorkspace = useWorkspaceStore(state => state.isEnterWorkspace);
    const room = useRoomStore(state => state.room);
    const roomId = useRoomStore(state => state.roomId);
    const setIsEnterWorkspace = useWorkspaceStore(state => state.setIsEnterWorkspace);
    const setIsRoomLive = useWorkspaceStore(state => state.setIsRoomLive);
    const setEnvironmentInfo = useWorkspaceStore(state => state.setEnvironmentInfo);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDetails = async () => {
            if (interviewId && roomId) {
                try {
                    await fetchRoomDetails(interviewId, roomId);
                } catch (error) {
                    console.error("Error fetching room details:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        getDetails();
    }, [interviewId, roomId]);

    useEffect(() => {
        const getEnv = async () => {
            if (interviewId && room && room.status === "LIVE") {
                try {
                    const envInfo = await fetchInterviewEnvironment(interviewId);
                    setEnvironmentInfo(envInfo);
                } catch (error) {
                    console.error("Error fetching environment:", error);
                }
            }
        };
        getEnv();
    }, [interviewId, room, setEnvironmentInfo]);

    useEffect(() => {
        if (loading) return;

        if (room && room.status === "LIVE") {
            setIsRoomLive(true);
            setIsEnterWorkspace(true);
            //Setup Environment
        } else if (room && room.status === "WAITING") {
            navigate(`/interview/${interviewId}/room`);
        } else if (room == null && roomId) {
            navigate(`/interview/${interviewId}/room`);
        } else if (room == null && !roomId) {
            navigate(`/error`);
        }
    }, [loading, room, roomId, interviewId, navigate, setIsRoomLive, setIsEnterWorkspace]);

    return {
        isEnterWorkspace
    };
};

export default useEnvironment;