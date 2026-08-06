import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCandidateApplications,
  fetchApplicationById,
  updateCandidateApplication,
  submitCandidateAvailability,
  fetchCandidateAvailability,
} from "../services/candidate.service";
import { candidateKeys } from "./candidateKeys";

/**
 * Fetches all applications submitted by the logged-in candidate.
 *
 * @param {import("@tanstack/react-query").UseQueryOptions} [options]
 *
 * @returns {{
 *   applications: Application[],
 *   isLoading: boolean,
 *   isError: boolean,
 *   error: Error | null,
 *   refetch: () => void,
 * }}
 */
export const useApplications = (options = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: candidateKeys.applications.list(),
    queryFn: fetchCandidateApplications,
    staleTime: 1000 * 60 * 3,  // 3 minutes
    ...options,
  });

  return {
    applications: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
};

/**
 * Fetches a single application by its ID.
 *
 * @param {string} id  Application ObjectId
 * @param {import("@tanstack/react-query").UseQueryOptions} [options]
 *
 * @returns {{
 *   application: Application | undefined,
 *   isLoading: boolean,
 *   isError: boolean,
 *   error: Error | null,
 *   refetch: () => void,
 * }}
 */
export const useApplicationById = (id, options = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: candidateKeys.applications.detail(id),
    queryFn: () => fetchApplicationById(id),
    enabled: !!id,   // don't fire if id is undefined/null
    staleTime: 1000 * 60 * 5,
    ...options,
  });

  return {
    application: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

/**
 * Mutation hook: update an APPLIED application's editable fields.
 * On success, invalidates the applications list cache.
 */
export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCandidateApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.applications.list() });
    },
  });
};

/**
 * Mutation hook to submit slot availability.
 */
export const useSubmitAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitCandidateAvailability,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: candidateKeys.applications.list() });
      queryClient.invalidateQueries({ queryKey: candidateKeys.slots.detail(variables.id) });
    },
  });
};

/**
 * Query hook to fetch slot availability for a specific application.
 */
export const useAvailability = (applicationId, options = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: candidateKeys.slots.detail(applicationId),
    queryFn: () => fetchCandidateAvailability(applicationId),
    enabled: !!applicationId,
    retry: false,
    ...options,
  });

  return { availability: data, isLoading, isError, error, refetch };
};


