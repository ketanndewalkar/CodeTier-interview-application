/**
 * Central place to tune the scheduling engine without touching business logic.
 * Org-level overrides can be merged on top of these defaults later.
 */
export default {
  // How many days ahead to search for a feasible slot if the candidate's
  // submitted availability spans a wide window.
  SCHEDULING_WINDOW_DAYS: 14,

  // Fallback: if nothing feasible in the initial window, widen once and retry.
  WIDENED_WINDOW_DAYS: 21,

  // Default buffer (minutes) to enforce between back-to-back interviews when
  // JobOpening.interviewConfig.bufferTime is not set.
  DEFAULT_BUFFER_MINUTES: 10,

  // Ideal buffer used by the comfort scorer (bigger than the strict minimum
  // buffer -- this is what "comfortable" looks like, not just "legal").
  IDEAL_BUFFER_MINUTES: 20,

  // Beyond this many interviews in a single day, comfort score is penalized.
  MAX_COMFORTABLE_INTERVIEWS_PER_DAY: 4,

  // A leftover gap in a free interval shorter than this (after slicing out
  // a slot) is considered "wasted"/fragmented and is penalized.
  MIN_USABLE_BLOCK_MINUTES: 20,

  // How many of an interviewer's earliest feasible slots get individually
  // scored (bounds cost for interviewers with very open calendars).
  MAX_SLOTS_SCORED_PER_INTERVIEWER: 20,

  // How many top-ranked interviewers to fall back through on a slot
  // conflict at commit time, before doing a full pipeline re-run.
  MAX_FALLBACK_CANDIDATES: 3,

  // Scoring weights -- must conceptually sum to 1 (not enforced, but keep
  // them normalized when tuning).
  WEIGHTS: {
    skillRelevance: 0.20,
    workload: 0.20,
    comfort: 0.20,
    fragmentation: 0.15,
    continuity: 0.10,
    candidateWaiting: 0.10,
    earliestSlot: 0.05,
  },

  // Statuses that count as "occupying" an interviewer's calendar.
  ACTIVE_INTERVIEW_STATUSES: ['SCHEDULED', 'IN_PROGRESS'],
};
