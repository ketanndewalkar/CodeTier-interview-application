class RankingService {
  /**
   * Ranks scored interviewers highest-first, with a deterministic
   * tie-break chain (never random / never dependent on array order):
   *   1. total score
   *   2. workload score (prefer the less-loaded interviewer)
   *   3. earlier slot
   *   4. interviewerId (stable final fallback)
   */
  rank(scoredInterviewers) {
    return [...scoredInterviewers].sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;

      if (b.breakdown.workloadScore !== a.breakdown.workloadScore) {
        return b.breakdown.workloadScore - a.breakdown.workloadScore;
      }

      const slotDiff = a.bestSlot.start.getTime() - b.bestSlot.start.getTime();
      if (slotDiff !== 0) return slotDiff;

      return String(a.interviewerId).localeCompare(String(b.interviewerId));
    });
  }
}

export default new RankingService();
