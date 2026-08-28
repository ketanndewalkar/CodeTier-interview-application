import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRoomStore = create(
  persist(
    (set) => ({
      room: null,
      status: "WAITING",
      roomId: null,
      setRoom: (room) => set({ room }),
      setRoomId: (roomId) => set({ roomId }),
      setStatus: (status) => set({ status }),
      isEnterRoom: false,
      setIsEnterRoom: (isEnterRoom) => set({ isEnterRoom }),
      resetRoom: () => set({ room: null, roomId: null, status: "WAITING", isEnterRoom: false }),
    }),
    {
      name: "room-store",
    }
  )
);