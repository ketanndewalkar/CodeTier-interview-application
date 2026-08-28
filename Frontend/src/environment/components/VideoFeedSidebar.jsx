import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';
import ChatInterface from './ChatInterface';
import useVideoFeedSidebar from '../hooks/useVideoFeedSidebar';
import { useRoomStore } from '../../store/room.store';
import { useUserStore } from '../../store/userStore';

// Simple helper component to render WebRTC MediaStream safely
const VideoFeed = ({ stream, isMuted = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={isMuted}
      className="w-full h-full object-cover rounded-xl"
    />
  );
};

const VideoFeedSidebar = () => {
  const {
    localStream,
    remoteStreams,
    initializeWebRTC
  } = useVideoFeedSidebar();

  const user = useUserStore(state => state.user);
  const room = useRoomStore(state => state.room);

  const [localVideoEnabled, setLocalVideoEnabled] = useState(true);
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);

  // Initialize WebRTC on mount/setup
  useEffect(() => {
    initializeWebRTC();
  }, [initializeWebRTC]);

  // Handle local track toggle actions
  const toggleLocalVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setLocalVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleLocalAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setLocalAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // Roles details
  const isInterviewer = user?.role === 'INTERVIEWER';

  // Identify remote participant
  const remoteParticipant = room?.participants?.find(
    p => p.userId.toString() !== user?._id?.toString()
  );

  const remoteStream = remoteParticipant
    ? remoteStreams.get(remoteParticipant.userId.toString())
    : null;

  // Determine streams and states for Interviewer and Candidate
  const interviewerStream = isInterviewer ? localStream : remoteStream;
  const candidateStream = isInterviewer ? remoteStream : localStream;

  const interviewerHasVideo = isInterviewer
    ? (!!localStream && localVideoEnabled)
    : !!remoteStream;
  const interviewerHasMic = isInterviewer
    ? (!!localStream && localAudioEnabled)
    : !!remoteStream;

  const candidateHasVideo = isInterviewer
    ? !!remoteStream
    : (!!localStream && localVideoEnabled);
  const candidateHasMic = isInterviewer
    ? !!remoteStream
    : (!!localStream && localAudioEnabled);

  return (
    <div className="w-80 h-full bg-[#0a0a0f] border-l border-neutral-800/80 flex flex-col flex-shrink-0 min-h-0 select-none">
      {/* Video feeds section */}
      <div className="p-4 flex flex-col gap-4 flex-shrink-0 bg-[#07070b]">

        {/* Interviewer Feed */}
        <div className="relative group rounded-xl overflow-hidden aspect-video bg-[#111019] border border-neutral-800/80 flex items-center justify-center transition-all duration-300 hover:border-neutral-700">
          {interviewerHasVideo ? (
            <VideoFeed stream={interviewerStream} isMuted={isInterviewer} />
          ) : (
            // Camera Disabled Mock
            <div className="absolute inset-0 flex items-center justify-center bg-[#13121c]">
              <VideoOff size={30} className="text-neutral-700/80" />
            </div>
          )}

          {/* Bottom Meta Overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-medium text-neutral-300">
            <span className={`w-2 h-2 rounded-full ${interviewerHasVideo ? 'bg-indigo-400' : 'bg-neutral-500'}`} />
            Interviewer
            {interviewerHasMic ? (
              <Mic size={10} className="text-indigo-400 ml-1" />
            ) : (
              <MicOff size={10} className="text-neutral-500 ml-1" />
            )}
          </div>

          {/* Action Overlay Controls (Visible on hover, only for the actual local Interviewer) */}
          {isInterviewer && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={toggleLocalVideo}
                className={`p-1.5 rounded-md backdrop-blur-md border border-neutral-700/30 transition-all cursor-pointer
                  ${localVideoEnabled ? 'bg-indigo-500 text-white' : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200'}`}
              >
                {localVideoEnabled ? <Video size={12} /> : <VideoOff size={12} />}
              </button>
              <button
                onClick={toggleLocalAudio}
                className={`p-1.5 rounded-md backdrop-blur-md border border-neutral-700/30 transition-all cursor-pointer
                  ${localAudioEnabled ? 'bg-indigo-500 text-white' : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200'}`}
              >
                {localAudioEnabled ? <Mic size={12} /> : <MicOff size={12} />}
              </button>
            </div>
          )}
        </div>

        {/* Candidate Feed */}
        <div className="relative group rounded-xl overflow-hidden aspect-video bg-[#111019] border border-neutral-800/80 flex items-center justify-center transition-all duration-300 hover:border-neutral-700">
          {candidateHasVideo ? (
            <VideoFeed stream={candidateStream} isMuted={!isInterviewer} />
          ) : (
            // Camera Disabled Mock
            <div className="absolute inset-0 flex items-center justify-center bg-[#13121c]">
              <VideoOff size={30} className="text-neutral-700/80" />
            </div>
          )}

          {/* Bottom Meta Overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-medium text-neutral-300">
            <span className={`w-2 h-2 rounded-full ${candidateHasVideo ? 'bg-[#f97316]' : 'bg-neutral-500'}`} />
            Candidate
            {candidateHasMic ? (
              <Mic size={10} className="text-amber-500 ml-1" />
            ) : (
              <MicOff size={10} className="text-neutral-500 ml-1" />
            )}
          </div>

          {/* Action Overlay Controls (Visible on hover, only for the actual local Candidate) */}
          {!isInterviewer && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={toggleLocalVideo}
                className={`p-1.5 rounded-md backdrop-blur-md border border-neutral-700/30 transition-all cursor-pointer
                  ${localVideoEnabled ? 'bg-amber-600 text-white' : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200'}`}
              >
                {localVideoEnabled ? <Video size={12} /> : <VideoOff size={12} />}
              </button>
              <button
                onClick={toggleLocalAudio}
                className={`p-1.5 rounded-md backdrop-blur-md border border-neutral-700/30 transition-all cursor-pointer
                  ${localAudioEnabled ? 'bg-amber-600 text-white' : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200'}`}
              >
                {localAudioEnabled ? <Mic size={12} /> : <MicOff size={12} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat panel */}
      <ChatInterface />
    </div>
  );
};

export default VideoFeedSidebar;
