import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitApplication } from "../services/candidate.service";
import { candidateKeys } from "./candidateKeys";
import toast from "react-hot-toast";

/**
 * Mutation hook to submit a job application.
 *
 * Usage:
 *   const { apply, isSubmitting } = useCreateApplication();
 *   apply({ jobId, formData });   // formData is a FormData instance
 *
 * On success, invalidates applications + dashboard stats caches.
 */
export const useCreateApplication = ({ onSuccess } = {}) => {
  const queryClient = useQueryClient();

  const { mutate: apply, isPending: isSubmitting } = useMutation({
    mutationFn: submitApplication,
    onSuccess: (data) => {
      // Bust application list + dashboard stats so counts refresh
      queryClient.invalidateQueries({ queryKey: candidateKeys.applications.all() });
      queryClient.invalidateQueries({ queryKey: candidateKeys.dashboard.all() });
      toast.success("Application submitted successfully!");
      onSuccess?.(data);
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message ?? "Failed to submit application.";
      toast.error(message);
    },
  });

  return { apply, isSubmitting };
};
