import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrganizationJobs,
  createJobOpening,
  updateJobOpening,
  changeJobStatus,
  deleteJobOpening,
  fetchJobApplications,
  fetchOrganizationApplications,
  updateApplicationStatus,
  fetchOrganizationInterviews,
  fetchEnvironments,
} from "../services/organization.service";
import { organizationKeys } from "./organizationKeys";
import { useUserStore } from "../../../store/userStore";

// ── Jobs ─────────────────────────────────────────────────────────────────────

/**
 * Fetch all jobs for the logged-in organization.
 * Returns `jobs` as `undefined` while loading so components can distinguish
 * loading-state from truly empty.
 */
export const useOrganizationJobs = (options = {}) => {
  const user = useUserStore((state) => state.user);
  const orgId = user?._id;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: organizationKeys.jobs.list(orgId),
    queryFn: () => fetchOrganizationJobs(orgId),
    enabled: !!orgId,
    staleTime: 1000 * 60 * 3,
    ...options,
  });

  return { jobs: data, isLoading, isError, error, refetch };
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJobOpening,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.jobs.all() });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateJobOpening,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.jobs.all() });
    },
  });
};

export const useChangeJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeJobStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.jobs.all() });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteJobOpening,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.jobs.all() });
    },
  });
};

// ── Applications ─────────────────────────────────────────────────────────────

/**
 * Fetch ALL applications for the logged-in organization (org-wide).
 */
export const useOrganizationApplications = (options = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: organizationKeys.applications.list(),
    queryFn: fetchOrganizationApplications,
    staleTime: 1000 * 60 * 2,
    ...options,
  });

  return { applications: data, isLoading, isError, error, refetch };
};

/**
 * Mutation to update an application's status (SHORTLISTED, REJECTED, HIRED…).
 */
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.applications.all() });
    },
  });
};

/**
 * Fetch applications for a specific job opening (per-job view).
 */
export const useJobApplications = (jobId, options = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: organizationKeys.applications.byJob(jobId),
    queryFn: () => fetchJobApplications(jobId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 2,
    ...options,
  });

  return { applications: data, isLoading, isError, error, refetch };
};

// ── Interviews ────────────────────────────────────────────────────────────────

/**
 * Fetch ALL interviews for the logged-in organization.
 */
export const useOrganizationInterviews = (options = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: organizationKeys.interviews.list(),
    queryFn: fetchOrganizationInterviews,
    staleTime: 1000 * 60 * 2,
    ...options,
  });

  return { interviews: data, isLoading, isError, error, refetch };
};

/**
 * Fetch all active environments.
 */
export const useEnvironments = (options = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: organizationKeys.environments.list(),
    queryFn: fetchEnvironments,
    staleTime: 1000 * 60 * 10, // 10 mins (rarely changes)
    ...options,
  });

  return { environments: data ?? [], isLoading, isError, error, refetch };
};

