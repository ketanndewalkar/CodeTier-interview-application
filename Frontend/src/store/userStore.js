import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      roleRoute:{
        "CANDIDATE":"/dashboard",
        "INTERVIEWER":"/interviewer/dashboard",
        "ORGANIZATION":"/organization/dashboard",
      },
      flag:"true",
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "auth-store",
    },
  ),
);
