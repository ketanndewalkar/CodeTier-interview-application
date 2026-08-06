/**
 * Centralised React Query key factory for all candidate-scoped queries.
 * Using factory functions keeps keys consistent and makes targeted
 * invalidation trivial (e.g. invalidate everything under ["candidate"]).
 *
 * Usage:
 *   queryClient.invalidateQueries({ queryKey: candidateKeys.all })
 *   queryClient.invalidateQueries({ queryKey: candidateKeys.applications.all() })
 */
export const candidateKeys = {
  /** Root scope — invalidates every candidate query at once */
  all: ["candidate"],

  dashboard: {
    all: () => [...candidateKeys.all, "dashboard"],
    stats: () => [...candidateKeys.dashboard.all(), "stats"],
  },

  jobs: {
    all: () => [...candidateKeys.all, "jobs"],
    list: (params = {}) => [...candidateKeys.jobs.all(), "list", params],
    detail: (id) => [...candidateKeys.jobs.all(), "detail", id],
  },

  applications: {
    all: () => [...candidateKeys.all, "applications"],
    list: () => [...candidateKeys.applications.all(), "list"],
    detail: (id) => [...candidateKeys.applications.all(), "detail", id],
  },

  interviews: {
    all: () => [...candidateKeys.all, "interviews"],
    list: () => [...candidateKeys.interviews.all(), "list"],
    detail: (id) => [...candidateKeys.interviews.all(), "detail", id],
  },

  slots: {
    all: () => [...candidateKeys.all, "slots"],
    detail: (applicationId) => [...candidateKeys.slots.all(), "detail", applicationId],
  },
};
