import React, { useState } from "react";
import { X, Star, CheckCircle, AlertCircle, ShieldAlert, Award, FileText, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { submitInterviewEvaluation } from "../functions/interview.functions";
import { useNavigate } from "react-router-dom";

const RECOMMENDATION_OPTIONS = [
  { value: "STRONG_HIRE", label: "Strong Hire", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  { value: "HIRE", label: "Hire", color: "bg-green-500/20 text-green-300 border-green-500/40" },
  { value: "HOLD", label: "Hold / Re-evaluate", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  { value: "NO_HIRE", label: "No Hire", color: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
  { value: "STRONG_NO_HIRE", label: "Strong No Hire", color: "bg-red-600/30 text-red-400 border-red-600/50" },
];

const FINAL_DECISION_OPTIONS = [
  { value: "SELECTED", label: "Selected (Hired / Passed)", color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" },
  { value: "FURTHER_ROUND", label: "Shortlist for Further Round", color: "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" },
  { value: "REJECTED", label: "Rejected", color: "bg-rose-500/20 border-rose-500/40 text-rose-300" },
];

const RatingSelector = ({ label, value, onChange, max = 5 }) => {
  return (
    <div className="flex items-center justify-between py-1.5 px-3 bg-[#13121d] rounded-lg border border-neutral-800/60">
      <span className="text-xs font-medium text-neutral-300">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className={`p-1 rounded transition-colors cursor-pointer ${
              star <= value
                ? "text-amber-400 hover:text-amber-300"
                : "text-neutral-600 hover:text-neutral-400"
            }`}
          >
            <Star size={14} className={star <= value ? "fill-amber-400" : ""} />
          </button>
        ))}
      </div>
    </div>
  );
};

export const EvaluationModal = ({ isOpen, onClose, interviewId }) => {
  const navigate = useNavigate();

  // Overall Assessment
  const [overallRating, setOverallRating] = useState(4);
  const [recommendation, setRecommendation] = useState("HIRE");
  const [interviewerConfidence, setInterviewerConfidence] = useState(4);

  // Technical Ratings
  const [technical, setTechnical] = useState({
    problemSolving: 4,
    codingSkills: 4,
    dataStructuresAlgorithms: 3,
    technicalFundamentals: 4,
    systemDesign: 3,
    debuggingLogicalThinking: 4,
  });

  // Behavioral Ratings
  const [behavioral, setBehavioral] = useState({
    communication: 4,
    clarityOfThought: 4,
    confidence: 4,
    collaboration: 4,
    adaptability: 4,
    professionalism: 5,
  });

  // Qualitative Feedback
  const [feedback, setFeedback] = useState({
    strengths: "",
    areasForImprovement: "",
    keyObservations: "",
    notableResponses: "",
  });

  // Final Decision
  const [finalDecision, setFinalDecision] = useState("SELECTED");
  const [finalReason, setFinalReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");

  const { mutate: submitEvaluation, isPending } = useMutation({
    mutationFn: (payload) => submitInterviewEvaluation({ interviewId, data: payload }),
    onSuccess: (res) => {
      toast.success(res?.message || "Interview evaluated and completed successfully!");
      onClose();
      navigate(`/interview/${interviewId}/ended`, { replace: true });
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to submit interview evaluation.";
      toast.error(errorMsg);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!finalReason.trim()) {
      toast.error("Please provide a final reason for your evaluation decision.");
      return;
    }

    const payload = {
      overallRating,
      recommendation,
      interviewerConfidence,
      technical,
      behavioral,
      feedback,
      finalDecision,
      finalReason: finalReason.trim(),
      additionalComments: additionalComments.trim(),
    };

    submitEvaluation(payload);
  };

  const handleTechChange = (key, val) => {
    setTechnical((prev) => ({ ...prev, [key]: val }));
  };

  const handleBehavioralChange = (key, val) => {
    setBehavioral((prev) => ({ ...prev, [key]: val }));
  };

  const handleFeedbackChange = (key, val) => {
    setFeedback((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0b0a12] border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans text-neutral-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800/80 flex items-center justify-between bg-[#0e0d17]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Award size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Complete & Evaluate Interview</h2>
              <p className="text-xs text-neutral-400">Submit final ratings to end the session and teardown the environment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800">
          
          {/* Section 1: Overall Assessment */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Star size={14} /> Overall Assessment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <RatingSelector
                label="Overall Candidate Rating (1-5)"
                value={overallRating}
                onChange={setOverallRating}
              />
              <RatingSelector
                label="Interviewer Confidence (1-5)"
                value={interviewerConfidence}
                onChange={setInterviewerConfidence}
              />
            </div>

            {/* Recommendation Pills */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-medium text-neutral-300">Hiring Recommendation *</label>
              <div className="flex flex-wrap gap-2">
                {RECOMMENDATION_OPTIONS.map((opt) => {
                  const isSelected = recommendation === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setRecommendation(opt.value)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? `${opt.color} ring-1 ring-white/20 font-semibold scale-[1.02]`
                          : "bg-[#13121d] border-neutral-800 text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      {isSelected && <Check size={12} />}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-800/60" />

          {/* Section 2: Technical Evaluation */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <FileText size={14} /> Technical Evaluation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <RatingSelector
                label="Problem Solving"
                value={technical.problemSolving}
                onChange={(v) => handleTechChange("problemSolving", v)}
              />
              <RatingSelector
                label="Coding Skills"
                value={technical.codingSkills}
                onChange={(v) => handleTechChange("codingSkills", v)}
              />
              <RatingSelector
                label="Data Structures & Algorithms"
                value={technical.dataStructuresAlgorithms}
                onChange={(v) => handleTechChange("dataStructuresAlgorithms", v)}
              />
              <RatingSelector
                label="Technical Fundamentals"
                value={technical.technicalFundamentals}
                onChange={(v) => handleTechChange("technicalFundamentals", v)}
              />
              <RatingSelector
                label="System Design"
                value={technical.systemDesign}
                onChange={(v) => handleTechChange("systemDesign", v)}
              />
              <RatingSelector
                label="Debugging & Logical Thinking"
                value={technical.debuggingLogicalThinking}
                onChange={(v) => handleTechChange("debuggingLogicalThinking", v)}
              />
            </div>
          </div>

          <div className="h-px bg-neutral-800/60" />

          {/* Section 3: Behavioral Evaluation */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <CheckCircle size={14} /> Behavioral Evaluation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <RatingSelector
                label="Communication"
                value={behavioral.communication}
                onChange={(v) => handleBehavioralChange("communication", v)}
              />
              <RatingSelector
                label="Clarity of Thought"
                value={behavioral.clarityOfThought}
                onChange={(v) => handleBehavioralChange("clarityOfThought", v)}
              />
              <RatingSelector
                label="Confidence"
                value={behavioral.confidence}
                onChange={(v) => handleBehavioralChange("confidence", v)}
              />
              <RatingSelector
                label="Collaboration"
                value={behavioral.collaboration}
                onChange={(v) => handleBehavioralChange("collaboration", v)}
              />
              <RatingSelector
                label="Adaptability"
                value={behavioral.adaptability}
                onChange={(v) => handleBehavioralChange("adaptability", v)}
              />
              <RatingSelector
                label="Professionalism"
                value={behavioral.professionalism}
                onChange={(v) => handleBehavioralChange("professionalism", v)}
              />
            </div>
          </div>

          <div className="h-px bg-neutral-800/60" />

          {/* Section 4: Qualitative Feedback */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <FileText size={14} /> Qualitative Feedback
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-neutral-400 mb-1 block">Key Strengths</label>
                <textarea
                  rows={2}
                  value={feedback.strengths}
                  onChange={(e) => handleFeedbackChange("strengths", e.target.value)}
                  placeholder="e.g., Clean code structure, good grasp of async patterns..."
                  className="w-full bg-[#13121d] border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-400 mb-1 block">Areas for Improvement</label>
                <textarea
                  rows={2}
                  value={feedback.areasForImprovement}
                  onChange={(e) => handleFeedbackChange("areasForImprovement", e.target.value)}
                  placeholder="e.g., Edge-case validation, edge condition handling..."
                  className="w-full bg-[#13121d] border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-800/60" />

          {/* Section 5: Final Decision & Reason */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldAlert size={14} /> Final Decision & Justification *
            </h3>

            {/* Decision Pills */}
            <div className="flex flex-wrap gap-2.5">
              {FINAL_DECISION_OPTIONS.map((opt) => {
                const isSelected = finalDecision === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setFinalDecision(opt.value)}
                    className={`text-xs font-medium px-3.5 py-2 rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? `${opt.color} ring-1 ring-white/20 font-semibold scale-[1.02]`
                        : "bg-[#13121d] border-neutral-800 text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    {isSelected && <Check size={14} />}
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Final Reason Input */}
            <div>
              <label className="text-xs font-medium text-neutral-300 mb-1 block">
                Final Decision Reason / Summary *
              </label>
              <textarea
                required
                rows={3}
                value={finalReason}
                onChange={(e) => setFinalReason(e.target.value)}
                placeholder="Provide a clear technical and behavioral summary supporting your decision..."
                className="w-full bg-[#13121d] border border-neutral-800 rounded-lg p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Additional Comments */}
            <div>
              <label className="text-xs font-medium text-neutral-400 mb-1 block">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={2}
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Any confidential notes for HR or hiring managers..."
                className="w-full bg-[#13121d] border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-[#1a1926] hover:bg-[#252336] rounded-lg border border-neutral-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-lg shadow-emerald-900/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting & Teardown...
                </>
              ) : (
                <>
                  <CheckCircle size={14} />
                  Submit Evaluation & Stop Interview
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
