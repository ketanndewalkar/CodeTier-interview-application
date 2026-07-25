import config from '../config/scheduling.config.js';
import {
  calculateWorkloadScore,
  calculateComfortScore,
  calculateFragmentationScore,
  calculateContinuityScore,
  calculateCandidateWaitingScore,
  calculateEarliestSlotScore,
  calculateSkillRelevanceScore,
} from './scoring/heuristics.js';

class ScoringService {
  /**
   * Scores every (bounded) feasible slot for one interviewer, and returns
   * the ScoredInterviewer with the single best slot selected. Best-slot
   * selection is NOT a separate step -- it's a byproduct of scoring every
   * candidate slot and keeping the max, since slot-level comfort and
   * fragmentation differ per slot even for the same interviewer.
   */
  scoreInterviewer({
    interviewerId,
    matchedSkills,
    requiredSkills,
    feasibleSlots,
    workloadContext,
    orgAvgUtilizationRatio,
    now,
  }) {
    if (feasibleSlots.length === 0) return null;

    // Bound cost: only score the earliest N feasible slots. In practice the
    // top-scoring slot is almost never buried past the first N chronological
    // options, and this keeps cost flat regardless of how open a calendar is.
    const candidateSlots = feasibleSlots
      .slice()
      .sort((a, b) => a.start - b.start)
      .slice(0, config.MAX_SLOTS_SCORED_PER_INTERVIEWER);

    const skillRelevanceScore = calculateSkillRelevanceScore(matchedSkills, requiredSkills);
    const workloadScore = calculateWorkloadScore(workloadContext, orgAvgUtilizationRatio);

    let best = null;

    for (const slot of candidateSlots) {
      const comfortScore = calculateComfortScore(slot, workloadContext, config);
      const fragmentationScore = calculateFragmentationScore(slot, config);
      const continuityScore = calculateContinuityScore(slot, workloadContext, config);
      const candidateWaitingScore = calculateCandidateWaitingScore(slot, now);
      const earliestSlotScore = calculateEarliestSlotScore(slot, candidateSlots);

      const w = config.WEIGHTS;
      const totalScore =
        w.skillRelevance * skillRelevanceScore +
        w.workload * workloadScore +
        w.comfort * comfortScore +
        w.fragmentation * fragmentationScore +
        w.continuity * continuityScore +
        w.candidateWaiting * candidateWaitingScore +
        w.earliestSlot * earliestSlotScore;

      const scored = {
        slot,
        totalScore,
        breakdown: {
          skillRelevanceScore,
          workloadScore,
          comfortScore,
          fragmentationScore,
          continuityScore,
          candidateWaitingScore,
          earliestSlotScore,
        },
      };

      if (!best || scored.totalScore > best.totalScore) {
        best = scored;
      }
    }

    return {
      interviewerId,
      totalScore: best.totalScore,
      breakdown: best.breakdown,
      bestSlot: best.slot,
      candidateSlots, // kept for audit / fallback if this interviewer's top slot conflicts
    };
  }
}

export default new ScoringService();
