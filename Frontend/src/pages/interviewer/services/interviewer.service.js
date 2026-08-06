import { api } from "../../../services/api/axiosInstance";

/**
 * Fetches interviews assigned to the currently authenticated interviewer.
 * @returns {Promise<Array>}
 */
export const fetchInterviewerInterviews = async () => {
  const res = await api.get("/interview/interviewer");
  return res.data.data;
};

/**
 * Fetches the availability schedule of the logged-in interviewer.
 * @returns {Promise<Object>}
 */
export const fetchInterviewerAvailability = async () => {
  const res = await api.get("/availability");
  return res.data.data;
};

/**
 * Creates or updates availability settings.
 * @param {Object} payload { timezone, recurringAvailability }
 * @returns {Promise<Object>}
 */
export const updateInterviewerAvailability = async (payload) => {
  try {
    const res = await api.put("/availability", payload);
    return res.data.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const res = await api.post("/availability", payload);
      return res.data.data;
    }
    throw error;
  }
};

/**
 * Schedules an interview slot.
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export const scheduleInterviewSlot = async (payload) => {
  const res = await api.post("/slot", payload);
  return res.data.data;
};

/**
 * Submits feedback/evaluation for a candidate.
 * @param {Object} payload { interviewId, candidateName, rating, notes, recommendation }
 * @returns {Promise<Object>}
 */
export const submitCandidateFeedback = async ({ interviewId, ...feedbackData }) => {
  const res = await api.post(`/interview/${interviewId}/feedback`, feedbackData);
  return res.data.data;
};
