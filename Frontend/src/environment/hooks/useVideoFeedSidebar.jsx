import { useState, useEffect, useCallback, useRef } from 'react';
import { useUserStore } from '../../store/userStore';
import { useOutletContext } from 'react-router-dom';
import { RTC_EVENTS, SOCKET_NAMESPACE } from '../../utils/constants';
import { useRoomStore } from '../../store/room.store';

// Helper to modify SDP to force high-quality stereo Opus audio (like Zoom/Meet)
// Configures high bitrate, FEC (Forward Error Correction) to prevent packet loss crackles,
// and disables DTX (Discontinuous Transmission) to avoid signal clipping during silence.
const preferHighQualityAudio = (sdp) => {
    const opusRegex = /a=rtpmap:(\d+) opus\/48000\/2/i;
    const match = sdp.match(opusRegex);
    if (!match) return sdp;
    const opusPayloadType = match[1];

    const fmtpRegex = new RegExp(`a=fmtp:${opusPayloadType} (\\S+)`);
    const fmtpMatch = sdp.match(fmtpRegex);

    // Zoom/Meet configurations: 128kbps stereo, FEC, Constant Bitrate (CBR), no DTX
    const highQualityParams = "stereo=1;maxaveragebitrate=128000;useinbandfec=1;usedtx=0;cbr=1";

    if (fmtpMatch) {
        return sdp.replace(
            fmtpRegex,
            `a=fmtp:${opusPayloadType} ${highQualityParams};${fmtpMatch[1]}`
        );
    } else {
        const rtpmapLine = `a=rtpmap:${opusPayloadType} opus/48000/2`;
        return sdp.replace(
            rtpmapLine,
            `${rtpmapLine}\r\na=fmtp:${opusPayloadType} ${highQualityParams}`
        );
    }
};

const useVideoFeedSidebar = () => {
    // useState and Refs
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const peersRef = useRef(new Map());
    const remoteStreamRef = useRef(new Map());
    const localStreamRef = useRef(null);

    // Obtaining zustand state
    const user = useUserStore(state => state.user);
    const room = useRoomStore(state => state.room);

    // Socket from Context
    const { socket } = useOutletContext();

    // Helper to determine if we are polite
    const getIsPolite = useCallback((peerId) => {
        return (user?._id?.toString() > peerId.toString());
    }, [user]);

    // Create Peer Connection
    const createPeerConnection = useCallback((peerId) => {
        if (peersRef.current.has(peerId)) {
            return peersRef.current.get(peerId);
        }
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        const peer = {
            pc,
            isPolite: getIsPolite(peerId),
            makingOffer: false,
            ignoreOffer: false,
            isSettingRemoteAnswerPending: false
        };
        peersRef.current.set(peerId, peer);

        return peer;
    }, [getIsPolite]);

    const addLocalTracks = useCallback((peer) => {
        const stream = localStreamRef.current;
        if (!stream) return;
        const senders = peer.pc.getSenders();
        stream.getTracks().forEach(track => {
            const alreadyAdded = senders.some(sender => sender.track === track);
            if (!alreadyAdded) {
                peer.pc.addTrack(track, stream);
            }
        });
    }, []);

    const setupTrackHandler = useCallback((peerId, peer) => {
        peer.pc.ontrack = (event) => {
            const stream = event.streams[0];
            if (!stream) {
                return;
            }
            remoteStreamRef.current.set(peerId, stream);
            setRemoteStreams(new Map(remoteStreamRef.current));
        };
    }, []);

    const setupIceHandler = useCallback((peerId, peer) => {
        peer.pc.onicecandidate = (event) => {
            if (!event.candidate) {
                return;
            }
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    namespace: SOCKET_NAMESPACE.RTC,
                    event: RTC_EVENTS.ICE_CANDIDATE,
                    from: user?._id?.toString(),
                    to: peerId,
                    payload: {
                        candidate: event.candidate
                    }
                }));
            }
        };
    }, [socket, user]);

    const setupNegotiationHandler = useCallback((peerId, peer) => {
        peer.pc.onnegotiationneeded = async () => {
            try {
                peer.makingOffer = true;
                const offer = await peer.pc.createOffer();
                const modifiedOffer = {
                    type: offer.type,
                    sdp: preferHighQualityAudio(offer.sdp)
                };
                await peer.pc.setLocalDescription(modifiedOffer);
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        namespace: SOCKET_NAMESPACE.RTC,
                        event: RTC_EVENTS.OFFER,
                        from: user?._id?.toString(),
                        to: peerId,
                        payload: {
                            offer: peer.pc.localDescription
                        }
                    }));
                }
            } catch (error) {
                // negotiation error silenced
            } finally {
                peer.makingOffer = false;
            }
        };
    }, [socket, user]);

    const getLocalStream = useCallback(async () => {
        if (localStreamRef.current) {
            return localStreamRef.current;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            },
            video: true
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
        return stream;
    }, []);

    const preparePeer = useCallback((peerId) => {
        const isNew = !peersRef.current.has(peerId);
        const peer = createPeerConnection(peerId);
        
        // Always try to attach local tracks if they are available
        addLocalTracks(peer);
        
        if (isNew) {
            setupTrackHandler(peerId, peer);
            setupIceHandler(peerId, peer);
            setupNegotiationHandler(peerId, peer);
        }
        return peer;
    }, [createPeerConnection, addLocalTracks, setupTrackHandler, setupIceHandler, setupNegotiationHandler]);

    const handleOffer = useCallback(async (message) => {
        const peerId = message.from;
        const peer = preparePeer(peerId);
        const { pc, isPolite } = peer;
        const offerCollision = peer.makingOffer || pc.signalingState !== "stable";
        if (!isPolite && offerCollision) {
            peer.ignoreOffer = true;
            return;
        }

        peer.ignoreOffer = false;
        try {
            const remoteOffer = {
                type: message.payload.offer.type,
                sdp: preferHighQualityAudio(message.payload.offer.sdp)
            };

            if (offerCollision) {
                await Promise.all([
                    pc.setLocalDescription({ type: "rollback" }),
                    pc.setRemoteDescription(remoteOffer)
                ]);
            } else {
                await pc.setRemoteDescription(remoteOffer);
            }

            const answer = await pc.createAnswer();
            const modifiedAnswer = {
                type: answer.type,
                sdp: preferHighQualityAudio(answer.sdp)
            };
            await pc.setLocalDescription(modifiedAnswer);

            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    namespace: SOCKET_NAMESPACE.RTC,
                    event: RTC_EVENTS.ANSWER,
                    from: user?._id?.toString(),
                    to: peerId,
                    payload: {
                        answer: pc.localDescription
                    }
                }));
            }
        } catch (error) {
            console.error("Error handling offer:", error);
        }
    }, [preparePeer, socket, user]);

    const handleAnswer = useCallback(async (message) => {
        const peer = peersRef.current.get(message.from);
        if (!peer) {
            return;
        }
        peer.isSettingRemoteAnswerPending = true;

        try {
            const remoteAnswer = {
                type: message.payload.answer.type,
                sdp: preferHighQualityAudio(message.payload.answer.sdp)
            };
            await peer.pc.setRemoteDescription(remoteAnswer);
        } catch (error) {
            console.error("Error setting remote description:", error);
        } finally {
            peer.isSettingRemoteAnswerPending = false;
        }
    }, []);

    const handleIceCandidate = useCallback(async (message) => {
        const peer = peersRef.current.get(message.from);
        if (!peer) {
            return;
        }
        try {
            await peer.pc.addIceCandidate(message.payload.candidate);
        } catch (error) {
            if (!peer.ignoreOffer) {
                // ICE candidate error silenced
            }
        }
    }, []);

    const initializeWebRTC = useCallback(
        async () => {
            if (!room?.participants || !room.participants.length) {
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                // STEP 1
                // Get camera + microphone
                await getLocalStream();
                // STEP 2
                // Create connection for every
                // remote participant
                room.participants.forEach(
                    participant => {
                        const peerId = participant.userId.toString();
                        const myId = user?._id?.toString();
                        if (peerId === myId) {
                            return;
                        }
                        preparePeer(peerId);
                    }
                );
            } catch (error) {
                console.error(
                    "WebRTC initialization failed:",
                    error
                );
                setError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [
            room,
            user?._id,
            getLocalStream,
            preparePeer
        ]
    );

    // WebRTC socket message routing
    useEffect(() => {
        if (!socket) return;

        const setupRTCHandler = (message) => {
            try {
                const result = JSON.parse(message.data);
                if (result.namespace !== SOCKET_NAMESPACE.RTC) {
                    return;
                }
                switch (result.event) {
                    case RTC_EVENTS.OFFER:
                        handleOffer(result); break;
                    case RTC_EVENTS.ANSWER:
                        handleAnswer(result); break;
                    case RTC_EVENTS.ICE_CANDIDATE:
                        handleIceCandidate(result); break;
                }
            } catch (error) {
                // RTC message parse error silenced
            }
        };

        socket.addEventListener("message", setupRTCHandler);
        return () => socket.removeEventListener("message", setupRTCHandler);
    }, [socket, handleOffer, handleAnswer, handleIceCandidate]);

    // Cleanup peer connections for participants who left the room
    useEffect(() => {
        if (!room?.participants) return;
        
        const participantIds = new Set(room.participants.map(p => p.userId.toString()));
        const myId = user?._id?.toString();
        
        let hasChanges = false;
        peersRef.current.forEach((peer, peerId) => {
            if (!participantIds.has(peerId) && peerId !== myId) {
                peer.pc.close();
                peersRef.current.delete(peerId);
                remoteStreamRef.current.delete(peerId);
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            setRemoteStreams(new Map(remoteStreamRef.current));
        }
    }, [room?.participants, user?._id]);

    // Whenever localStream becomes available/active, attach tracks to all existing connections
    useEffect(() => {
        if (!localStream) return;
        peersRef.current.forEach((peer) => {
            addLocalTracks(peer);
        });
    }, [localStream, addLocalTracks]);

    // Cleanup on hook unmount
    useEffect(() => {
        const peers = peersRef.current;
        const remoteStreams = remoteStreamRef.current;
        const localStreamRefVal = localStreamRef;
        return () => {
            peers.forEach((peer) => {
                peer.pc.close();
            });
            peers.clear();
            remoteStreams.clear();
            
            if (localStreamRefVal.current) {
                localStreamRefVal.current.getTracks().forEach(track => track.stop());
                localStreamRefVal.current = null;
            }
        };
    }, []);

    return {
        localStream,
        remoteStreams,
        isLoading,
        error,
        initializeWebRTC
    };
};

export default useVideoFeedSidebar;