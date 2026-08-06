import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "../services/candidate.service";
import { candidateKeys } from "./candidateKeys";

/**
 * Fetches the list of job openings available to candidates.
 * Backend: GET /job/get-all
 *
 * @param {import("@tanstack/react-query").UseQueryOptions} [options]
 *
 * @returns {{
 *   jobs: Job[],
 *   isLoading: boolean,
 *   isError: boolean,
 *   error: Error | null,
 *   refetch: () => void,
 * }}
 */
export const useJobs = (options = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: candidateKeys.jobs.list(),
    queryFn: fetchJobs,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });

  return {
    jobs: Array.isArray(data) ? data : [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
