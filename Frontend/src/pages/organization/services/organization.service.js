import { api } from "../../../services/api/axiosInstance";

// ── Jobs ──────────────────────────────────────────────────────────────────────

export const fetchOrganizationJobs = async (organizationId) => {
  const url = organizationId
    ? `/job/get-all?organizationId=${organizationId}`
    : "/job/get-all";
  const res = await api.get(url);
  return res.data.data;
};

export const createJobOpening = async (jobData) => {
  const res = await api.post("/job/create", jobData);
  return res.data.data;
};

export const updateJobOpening = async ({ id, data }) => {
  const res = await api.patch(`/job/${id}`, data);
  return res.data.data;
};

export const changeJobStatus = async ({ id, status }) => {
  const res = await api.put(`/job/status/${id}?status=${status}`);
  return res.data.data;
};

export const deleteJobOpening = async (id) => {
  const res = await api.delete(`/job/${id}`);
  return res.data.data;
};

// ── Applications ──────────────────────────────────────────────────────────────

/**
 * Fetches ALL applications for the logged-in organization.
 * Backend: GET /application/organization
 */
export const fetchOrganizationApplications = async () => {
  const res = await api.get("/application/organization");
  return res.data.data;
};

/**
 * Updates an application's status (SHORTLISTED, REJECTED, HIRED…).
 * Backend: POST /application/:id?status=...
 */
export const updateApplicationStatus = async ({ id, status }) => {
  const res = await api.post(`/application/${id}?status=${status}`);
  return res.data.data;
};

/**
 * Fetches applications for a specific job opening (per-job view).
 * Backend: GET /application/job-opening/:jobId/get-all
 */
export const fetchJobApplications = async (jobId) => {
  const res = await api.get(`/application/job-opening/${jobId}/get-all`);
  return res.data.data;
};

// ── Interviews ────────────────────────────────────────────────────────────────

/**
 * Fetches ALL interviews for the logged-in organization.
 * Backend: GET /interview/organization
 */
export const fetchOrganizationInterviews = async () => {
  const res = await api.get("/interview/organization");
  return res.data.data;
};

/**
 * Fetches all active environments.
 * Backend: GET /environment/get-all
 */
export const fetchEnvironments = async () => {
  const res = await api.get("/environment/get-all");
  return res.data.data;
};


