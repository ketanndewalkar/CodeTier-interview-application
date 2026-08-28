import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { socketHandler } from '../../websocket';
import { useUserStore } from '../../store/userStore';
import { useRoomStore } from '../../store/room.store';
import { socketResponse } from '../../utils/socketResponse';
import { SOCKET_NAMESPACE, INTERVIEW_EVENTS } from '../../utils/constants';

const InterviewLayout = () => {
  const [socket, setSocket] = useState(null);
  const accessToken = useUserStore((state) => state.accessToken);
  const roomId = useRoomStore((state) => state.roomId);
  const user = useUserStore((state) => state.user);

  // Establish Web Socket connection
  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}?token=${accessToken}`);
    
    // Resolve setState in effect warning by deferring the call
    Promise.resolve().then(() => {
      setSocket(ws);
    });
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data)
        socketHandler(data);
    }

    return () => {
      ws.close();
    }
  }, [accessToken])

  // Automatically join the room on websocket connection establishment/reload
  useEffect(() => {
    if (!socket || !roomId || !user?._id) return;

    const message = socketResponse(
      SOCKET_NAMESPACE.INTERVIEW,
      INTERVIEW_EVENTS.JOIN_ROOM,
      user._id,
      null,
      { roomId },
    );

    const sendJoinMessage = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    };

    if (socket.readyState === WebSocket.OPEN) {
      sendJoinMessage();
    } else {
      socket.addEventListener("open", sendJoinMessage);
    }

    return () => {
      socket.removeEventListener("open", sendJoinMessage);
    };
  }, [socket, roomId, user?._id]);

  return (
    <div className='w-screen h-screen bg-[#07070b] text-neutral-200 flex flex-row overflow-hidden font-sans'>
      <Outlet context={{socket:socket}} />
    </div>
  )
}

export default InterviewLayout