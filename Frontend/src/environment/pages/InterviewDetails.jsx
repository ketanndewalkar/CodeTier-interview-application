import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  Check,
  Copy,
  User,
  Hash,
  Video,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { TailSpin } from "react-loader-spinner";
import useInterviewDetails from "../hooks/useInterviewDetails";
import { socketResponse } from "../../utils/socketResponse";
import { useUserStore } from "../../store/userStore";
import { useRoomStore } from "../../store/room.store";
import { INTERVIEW_EVENTS, SOCKET_NAMESPACE } from "../../utils/constants";

// Custom Loading Screen Component with statement provision
const LoadingScreen = ({ message }) => {
  return (
    <div className="min-h-screen w-full bg-[#07070b] text-neutral-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <style>{`
        @keyframes loadingProgress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: loadingProgress 1.6s infinite ease-in-out;
        }
      `}</style>

      {/* Background decorative gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative w-full max-w-sm bg-zinc-950/80 border border-zinc-900/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center">
        {/* Glowing Spinner container */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md animate-pulse" />
          <TailSpin
            visible={true}
            height="50"
            width="50"
            color="#a855f7"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperClass="relative z-10"
          />
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-white tracking-wide font-sans mb-2">
          Preparing Environment
        </h2>

        {/* Statement Provision */}
        <p className="text-xs text-zinc-400 font-sans min-h-[36px] px-2 leading-relaxed transition-all duration-300">
          {message}
        </p>

        {/* Progress Bar Indicator */}
        <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden mt-6 relative">
          <div className="h-full w-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-progress absolute left-0 top-0 origin-left" />
        </div>
      </div>
    </div>
  );
};

const InterviewDetails = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const roomId = useRoomStore((state)=>state.roomId);
  const { socket } = useOutletContext();
  const {
    data,
    isPending,
    isLoading,
    error,
    mutate,
    roomPending,
    roomLoading,
  } = useInterviewDetails();
  const isJoining = roomPending || roomLoading;
  const [copiedId, setCopiedId] = useState(null);
  const [showInfoJson, setShowInfoJson] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Connecting to secure interview server...",
  );

  // Cycle through loading statements to show consistent progress feedback
  useEffect(() => {
    if (isPending || isLoading) {
      const messages = [
        "Connecting to secure interview server...",
        "Verifying candidate credentials...",
        "Fetching workspace environment configurations...",
        "Setting up real-time WebRTC streams...",
        "Preparing interactive whiteboard components...",
        "Launching secure sandboxed coding environment...",
      ];
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        setLoadingMessage(messages[index]);
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isPending, isLoading]);

  // Copy to clipboard helper
  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleJoin = () => {
    mutate(data._id);
  };

  const handleJoinRoom = () => {
    if (socket && roomId) {
      navigate(`/interview/${interviewId}/room`)
    }
  };

  // Custom loading screen triggered during data fetch
  if (isPending || isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#07070b] text-neutral-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-950/80 border border-rose-500/20 rounded-2xl p-6 text-center shadow-xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-4">
            <span className="text-xl font-bold">!</span>
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Unable to Load Interview
          </h3>
          <p className="text-xs text-zinc-400 mb-4">
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#07070b] text-neutral-200 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background decorative gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main glass card container */}
      <div className="relative w-full max-w-xl bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300">
        {/* Title / Header */}
        <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              Interview Details
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Review credentials before joining the interview environment
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-5">
          {/* Interview ID Row */}
          <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3.5 hover:border-zinc-800 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Hash className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Interview ID
                </span>
                <span className="text-sm font-mono text-zinc-300 truncate block">
                  {data._id || "N/A"}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleCopy(data._id || "", "interview")}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ml-2 shrink-0 cursor-pointer"
              title="Copy Interview ID"
            >
              {copiedId === "interview" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Candidate ID Row */}
          <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3.5 hover:border-zinc-800 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Candidate ID
                </span>
                <span className="text-sm font-mono text-zinc-300 truncate block">
                  {data.interviewerId._id}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleCopy(data.interviewerId._id, "candidate")}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ml-2 shrink-0 cursor-pointer"
              title="Copy Candidate ID"
            >
              {copiedId === "candidate" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Candidate Details JSON section */}
          <div className="border border-zinc-800/60 rounded-xl overflow-hidden bg-zinc-950/60">
            <button
              onClick={() => setShowInfoJson(!showInfoJson)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 text-xs font-semibold text-zinc-400 hover:bg-zinc-900/60 transition-colors cursor-pointer border-b border-zinc-850"
            >
              <span>INTERVIEWEE DETAILS</span>
              {showInfoJson ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showInfoJson && (
              <div className="p-4 font-mono text-xs text-purple-300 leading-relaxed bg-[#09090f]/50">
                <div>interviewId info : &#123;</div>
                <div className="pl-6">
                  <span className="text-zinc-500">ID :</span>{" "}
                  <span className="text-emerald-400">
                    "{data.candidateId._id}"
                  </span>
                  ,
                </div>
                <div className="pl-6">
                  <span className="text-zinc-500">name :</span>{" "}
                  <span className="text-emerald-400">
                    "{data.candidateId.name}"
                  </span>
                </div>
                <div>&#125;</div>
              </div>
            )}
          </div>
        </div>

        {/* Join button */}
        <div className="mt-8">
          <button
            disabled={isJoining || (roomId ? true : false)}
            onClick={handleJoin}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(124,58,237,0.15)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {isJoining && !roomId ? (
              <TailSpin
                height="18"
                width="18"
                color="#ffffff"
                visible={true}
                ariaLabel="button-loading"
              />
            ) : (
              <span>JOIN INTERVIEW</span>
            )}
          </button>
        </div>

        {roomId && (
          <div>
            <p className="w-full text-center mt-3 mx-auto">RoomId : {roomId}</p>

            <div className="mt-3">
              <button
                // disabled={isJoining}
                onClick={handleJoinRoom}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(124,58,237,0.15)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {isJoining && roomId ? (
                  <TailSpin
                    height="18"
                    width="18"
                    color="#ffffff"
                    visible={true}
                    ariaLabel="button-loading"
                  />
                ) : (
                  <span>JOIN ROOM</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewDetails;
