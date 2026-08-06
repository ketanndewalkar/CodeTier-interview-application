/**
 * Centralised React Query key factory for all organization-scoped queries.
 */
export const organizationKeys = {
  all: ["organization"],

  jobs: {
    all: () => [...organizationKeys.all, "jobs"],
    list: (orgId) => [...organizationKeys.jobs.all(), "list", orgId],
    detail: (id) => [...organizationKeys.jobs.all(), "detail", id],
  },

  applications: {
    all: () => [...organizationKeys.all, "applications"],
    list: () => [...organizationKeys.applications.all(), "list"],
    byJob: (jobId) => [...organizationKeys.applications.all(), "job", jobId],
  },

  interviews: {
    all: () => [...organizationKeys.all, "interviews"],
    list: () => [...organizationKeys.interviews.all(), "list"],
  },

  environments: {
    all: () => ["environments"],
    list: () => ["environments", "list"],
  },
};
