/**
 * Centralised React Query key factory for all interviewer-scoped queries.
 */
export const interviewerKeys = {
  all: ["interviewer"],

  interviews: {
    all: () => [...interviewerKeys.all, "interviews"],
    list: (params = {}) => [...interviewerKeys.interviews.all(), "list", params],
    detail: (id) => [...interviewerKeys.interviews.all(), "detail", id],
  },

  availability: {
    all: () => [...interviewerKeys.all, "availability"],
    detail: () => [...interviewerKeys.availability.all(), "detail"],
  },
};
