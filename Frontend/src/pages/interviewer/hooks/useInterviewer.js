import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchInterviewerInterviews,
  fetchInterviewerAvailability,
  updateInterviewerAvailability,
  scheduleInterviewSlot,
  submitCandidateFeedback,
} from "../services/interviewer.service";
import { interviewerKeys } from "./interviewerKeys";

/**
 * Custom hook to fetch assigned interviewer interviews.
 */
export const useInterviewerInterviews = (options = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: interviewerKeys.interviews.list(),
    queryFn: fetchInterviewerInterviews,
    staleTime: 1000 * 60 * 3, // 3 minutes
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

/**
 * Custom hook to fetch interviewer availability schedule.
 */
export const useInterviewerAvailability = (options = {}) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: interviewerKeys.availability.detail(),
    queryFn: fetchInterviewerAvailability,
    staleTime: 1000 * 60 * 5,
    ...options,
  });

  return {
    availability: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

/**
 * Mutation hook to update interviewer availability.
 */
export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInterviewerAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewerKeys.availability.all() });
    },
  });
};

/**
 * Mutation hook to schedule an interview slot.
 */
export const useScheduleInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleInterviewSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewerKeys.interviews.all() });
    },
  });
};

/**
 * Mutation hook to submit candidate evaluation/feedback.
 */
export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitCandidateFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewerKeys.interviews.all() });
    },
  });
};
