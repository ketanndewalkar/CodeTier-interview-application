/**
 * Intentionally decoupled from the transactional commit path (§ design doc:
 * "InterviewCreationService success is never rolled back due to a
 * notification failure"). In production this would enqueue a job
 * (BullMQ/Agenda) rather than send synchronously.
 */
class NotificationService {
  async notifyInterviewScheduled(interview) {
    // Placeholder -- wire up email/SMS/websocket push here.
    console.log(
      `[notification] Interview ${interview._id} scheduled: interviewer=${interview.interviewerId} candidate=${interview.candidateId} start=${interview.startTime.toISOString()}`
    );
  }

  async notifySchedulingFailed(applicationId, reason) {
    console.log(`[notification] Scheduling failed for application ${applicationId}: ${reason}`);
  }
}

export default new NotificationService();
