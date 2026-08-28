import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWorkspaceStore = create(
    persist(
        (set) => ({
            // State
            isRoomLive: false,
            isWorkspaceReady: false,
            isEnterWorkspace: false,
            workspaceInfo: null,
            environmentInfo: null,

            // Setters
            setIsEnterWorkspace: (isEnterWorkspace) => set({ isEnterWorkspace }),
            setWorkspaceInfo: (workspaceInfo) => set({ workspaceInfo }),
            setEnvironmentInfo: (environmentInfo) => set({ environmentInfo }),
            setIsRoomLive: (isRoomLive) => set({ isRoomLive }),

            // Reset action
            resetWorkspace: () =>
                set({
                    isEnterWorkspace: false,
                    workspaceInfo: null,
                    environmentInfo: null,
                }),
        }),
        {
            name: "workspace-store",
        },
    ),
);
