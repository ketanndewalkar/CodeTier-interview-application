import axios from "axios";
import { useUserStore } from "../../store/userStore";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  withCredentials: true,
});

// ── Request interceptor — attach Bearer token from Zustand store ──────────────
api.interceptors.request.use(
  (req) => {
    const { accessToken } = useUserStore.getState();
    if (accessToken) {
      req.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
);
