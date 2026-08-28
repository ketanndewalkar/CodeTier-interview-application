import React, { useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Video, User, CheckCircle2, Users } from "lucide-react";
import { useRoomStore } from "../../store/room.store";
import { socketResponse } from "../../utils/socketResponse";
import { INTERVIEW_EVENTS, SOCKET_NAMESPACE } from "../../utils/constants";
import { useUserStore } from "../../store/userStore";

const Lobby = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { socket } = useOutletContext();
  const isEnterRoom = useRoomStore((state) => state.isEnterRoom);
  const roomId = useRoomStore((state) => state.roomId);
  const room = useRoomStore(state => state.room)
  const user = useUserStore((state) => state.user);

  const handleStartInterview = () => {
    if (!socket || !roomId || !interviewId) return;

    const message = socketResponse(
      SOCKET_NAMESPACE.INTERVIEW,
      INTERVIEW_EVENTS.INTERVIEW_LIVE,
      user?._id,
      null,
      { roomId, interviewId },
    );

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  };

  useEffect(() => {
    if (!socket || !roomId) return;

    const message = socketResponse(
      SOCKET_NAMESPACE.INTERVIEW,
      INTERVIEW_EVENTS.JOIN_ROOM,
      user?._id,
      null,
      { roomId },
    );

    const sendJoinMessage = () => {
      socket.send(message);
    };

    if (socket.readyState === WebSocket.OPEN) {
      sendJoinMessage();
    } else {
      socket.addEventListener("open", sendJoinMessage);
    }

    return () => {
      socket.removeEventListener("open", sendJoinMessage);
    };
  }, [socket, roomId, user?._id, isEnterRoom]);

  useEffect(() => {
    if (!roomId) {
      navigate(`/interview/${interviewId}`);
    }
  }, [roomId, interviewId, navigate]);

  useEffect(() => {
    if (room?.status === "LIVE") {
      navigate(`/interview/${interviewId}/workspace`);
    }
  }, [room, interviewId, navigate]);

  if (!isEnterRoom) {
    return <>Entering the Room</>;
  }

  return (
    <div className="min-h-screen w-full bg-[#07070b] text-neutral-200 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background decorative gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main glass card container matching InterviewDetails styling */}
      <div className="relative w-full max-w-xl bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300">
        {/* Title / Header */}
        <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              Room Details
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Verify participant connections and room status before starting
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-5">
          {/* Room Status Row */}
          <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3.5 hover:border-zinc-800 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                <CheckCircle2 className={`w-4 h-4 ${room.status == "WAITING" ? "text-yellow-400" : "text-emerald-400"}`} />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Room Status
                </span>
                <span className={`text-sm font-semibold ${room.status == "WAITING" ? "text-yellow-400" : "text-emerald-400"} block`}>
                  {room?.status}
                </span>
              </div>
            </div>
          </div>

          {/* No of Participants Row */}
          <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3.5 hover:border-zinc-800 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  No of participants
                </span>
                <span className="text-sm font-mono text-zinc-300 block">{room?.participants?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Participants List Accordion/Section */}
          <div className="border border-zinc-800/60 rounded-xl overflow-hidden bg-zinc-950/60">
            <div className="px-4 py-3 bg-zinc-900/40 text-xs font-semibold text-zinc-400 border-b border-zinc-850">
              PARTICIPANTS
            </div>

            <div className="p-4 space-y-3 bg-[#09090f]/50">
              {room?.participants?.map((participant, index) => (
                <div key={participant.userId} className="flex items-center gap-3 text-sm text-zinc-300 font-sans">
                  <div className="w-6 h-6 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-white">{participant.name || 'User'}</span>
                    <span className="text-[10px] font-semibold bg-zinc-800/80 px-2 py-0.5 rounded text-zinc-400 uppercase tracking-wider">
                      {participant.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Start Interview button (rich purple platform styling, no gradient) */}
        {user.role == "INTERVIEWER" && <div className="mt-8">
          <button
            onClick={handleStartInterview}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(124,58,237,0.15)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span>START INTERVIEW</span>
          </button>
        </div>}
      </div>
    </div>
  );
};

export default Lobby;
