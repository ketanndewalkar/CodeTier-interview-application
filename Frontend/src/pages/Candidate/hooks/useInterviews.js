import { useQuery } from "@tanstack/react-query";
import { fetchCandidateInterviews } from "../services/candidate.service";
import { candidateKeys } from "./candidateKeys";

/**
 * Fetches all interviews scheduled for the logged-in candidate.
 *
 * @param {import("@tanstack/react-query").UseQueryOptions} [options]
 *
 * @returns {{
 *   interviews: Interview[],
 *   isLoading: boolean,
 *   isError: boolean,
 *   error: Error | null,
 *   refetch: () => void,
 * }}
 */
export const useInterviews = (options = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: candidateKeys.interviews.list(),
    queryFn: fetchCandidateInterviews,
    staleTime: 1000 * 60 * 2,  // 2 minutes — interviews are time-sensitive
    ...options,
  });

  return {
    interviews: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
