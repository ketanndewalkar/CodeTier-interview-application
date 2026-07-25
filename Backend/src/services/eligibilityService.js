import { User } from "../models/user.model.js";


/**
 * Finds interviewers eligible for a given job opening based on domain/skill
 * match. This is the required "domain check" -- an interviewer is only
 * considered at all if there is at least one overlapping skill with
 * JobOpening.requiredSkills. Skill match STRENGTH (not just presence) is
 * later used by the scoring engine (skillRelevanceScore), so we return the
 * overlap here too rather than recomputing it downstream.
 */
class EligibilityService {
  /**
   * @param {string[]} requiredSkills
   * @returns {Promise<Array<{ interviewer: object, matchedSkills: string[] }>>}
   */
  async findEligibleInterviewers(requiredSkills) {
    if (!requiredSkills || requiredSkills.length === 0) {
      throw new Error('JobOpening.requiredSkills is empty -- cannot determine eligibility');
    }

    const interviewers = await User.find({
      role: 'INTERVIEWER',
      skills: { $in: requiredSkills },
    }).lean();

    return interviewers.map((interviewer) => {
      const matchedSkills = (interviewer.skills || []).filter((skill) =>
        requiredSkills.includes(skill)
      );
      return { interviewer, matchedSkills };
    });
  }
}

export default new EligibilityService();
