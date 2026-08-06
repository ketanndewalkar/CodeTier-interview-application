import { api } from "../../../services/api/axiosInstance";

// ── Dashboard ────────────────────────────────────────────────────────────────

/**
 * Fetches aggregated numeric stats for the candidate dashboard.
 * Intended as the queryFn for useDashboardStats.
 * @returns {Promise<DashboardStats>}
 */
export const fetchCandidateDashboardStats = async () => {
  const res = await api.get("/dashboard/candidate/stats");
  return res.data.data;
};

// ── Jobs ─────────────────────────────────────────────────────────────────────

/**
 * Fetches all open job listings available to candidates.
 * Backend: GET /job/get-all  (returns OPEN, CLOSED, PAUSED when no orgId filter)
 * @returns {Promise<Job[]>}
 */
export const fetchJobs = async () => {
  const res = await api.get("/job/get-all");
  console.log(res.data)
  return res.data.data;
};

// ── Applications ─────────────────────────────────────────────────────────────

/**
 * Fetches all applications submitted by the logged-in candidate.
 * Backend: GET /application/candidate
 * @returns {Promise<Application[]>}
 */
export const fetchCandidateApplications = async () => {
  const res = await api.get("/application/candidate");
  return res.data.data;
};

/**
 * Fetches a single application by its ID.
 * @param {string} id  Application ObjectId
 * @returns {Promise<Application>}
 */
export const fetchApplicationById = async (id) => {
  const res = await api.get(`/application/${id}`);
  return res.data.data;
};

// ── Interviews ───────────────────────────────────────────────────────────────

/**
 * Fetches all interviews for the currently authenticated candidate.
 * @returns {Promise<Interview[]>}
 */
export const fetchCandidateInterviews = async () => {
  const res = await api.get("/interview/candidate");
  return res.data.data;
};

// ── Submit Application ────────────────────────────────────────────────────────

/**
 * Submits a job application with resume file as multipart/form-data.
 * Backend: POST /application/job-opening/:jobId
 * @param {{ jobId: string, formData: FormData }} payload
 * @returns {Promise<Application>}
 */
export const submitApplication = async ({ jobId, formData }) => {
  const res = await api.post(`/application/job-opening/${jobId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

/**
 * Updates an existing application (only allowed while status is APPLIED).
 * Backend: PATCH /application/:id/candidate-update
 * @param {{ id: string, data: Partial<Application> }} payload
 * @returns {Promise<Application>}
 */
export const updateCandidateApplication = async ({ id, data }) => {
  const res = await api.patch(`/application/${id}/candidate-update`, data);
  return res.data.data;
};

// ── Slot Availability ────────────────────────────────────────────────────────

/**
 * Submits the slots of candidate availability for scheduling.
 * Backend: POST /slot/application/:id
 */
export const submitCandidateAvailability = async ({ id, timezone, slots }) => {
  const res = await api.post(`/slot/application/${id}`, { timezone, slots });
  return res.data.data;
};

/**
 * Fetches the submitted slot availability for scheduling.
 * Backend: GET /slot/application/:id
 */
export const fetchCandidateAvailability = async (id) => {
  const res = await api.get(`/slot/application/${id}`);
  return res.data.data;
};


