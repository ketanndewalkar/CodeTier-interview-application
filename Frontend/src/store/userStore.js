import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      roleRoute:{
        "candidate":"/dashboard",
        "interviewer":"/interviewer/dashboard",
        "organization":"/company/dashboard",
      },
      flag:"true",
      setUser: (user) => set({ user: user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-store",
    },
  ),
);
