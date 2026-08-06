import { useQuery } from "@tanstack/react-query";
import { fetchCandidateDashboardStats } from "../services/candidate.service";
import { candidateKeys } from "./candidateKeys";

/**
 * Fetches all numerical stats shown on the candidate dashboard
 * (total applications, shortlisted, interviews scheduled, etc.)
 *
 * @param {import("@tanstack/react-query").UseQueryOptions} [options]  Extra TanStack Query options to override defaults
 *
 * @returns {{
 *   stats: import("../services/candidate.service").DashboardStats | undefined,
 *   isLoading: boolean,
 *   isError: boolean,
 *   error: Error | null,
 *   refetch: () => void,
 * }}
 */
export const useDashboardStats = (options = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: candidateKeys.dashboard.stats(),
    queryFn: fetchCandidateDashboardStats,
    staleTime: 1000 * 60 * 2,   // 2 minutes — numbers change rarely mid-session
    retry: 2,
    ...options,
  });

  return {
    stats: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
