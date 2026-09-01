import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ShieldCheck, ArrowRight, Home, Server, FileCode, Check, Award } from "lucide-react";
import { useUserStore } from "../../store/userStore";
import { motion } from "framer-motion";

export const InterviewEnded = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const { user } = useUserStore((state) => state.user || {});

  const handleReturnHome = () => {
    if (user?.role === "CANDIDATE") {
      navigate("/dashboard");
    } else if (user?.role === "INTERVIEWER") {
      navigate("/interviewer");
    } else if (user?.role === "ORGANIZATION") {
      navigate("/organization");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#07070b] text-neutral-200 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      
      {/* Glowing Green Backdrop Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl bg-zinc-950/80 border border-emerald-500/20 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl flex flex-col items-center text-center space-y-6"
      >
        
        {/* Animated Green Tick Ring Icon */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/40 relative z-10 border border-emerald-400/30"
          >
            <CheckCircle2 size={44} className="text-white stroke-[2.2]" />
          </motion.div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2 max-w-md">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wide uppercase">
            <Check size={12} className="stroke-[3]" /> Session Completed
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
            Interview Finished Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Thank you for participating. The interview session has ended, all ratings have been registered, and the sandbox environment was safely destroyed.
          </p>
        </div>

        {/* Satisfaction Checklist */}
        <div className="w-full bg-[#0c0b14]/90 border border-emerald-900/30 rounded-2xl p-4 sm:p-5 text-left space-y-3 shadow-inner">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
            <ShieldCheck size={14} /> Cleanup & Completion Summary
          </h3>

          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Check size={12} className="stroke-[3]" />
              </div>
              <span className="flex-1">
                <strong className="text-zinc-100">Evaluation Submitted:</strong> Structured ratings & feedback recorded.
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Check size={12} className="stroke-[3]" />
              </div>
              <span className="flex-1">
                <strong className="text-zinc-100">Docker Container Teardown:</strong> Isolated sandbox container stopped & removed.
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Check size={12} className="stroke-[3]" />
              </div>
              <span className="flex-1">
                <strong className="text-zinc-100">Workspace Files Cleaned:</strong> Temporary code directory deleted from storage.
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Check size={12} className="stroke-[3]" />
              </div>
              <span className="flex-1">
                <strong className="text-zinc-100">Database Synchronized:</strong> Application and interview statuses updated.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleReturnHome}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-950/40 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Home size={15} />
            Return to Dashboard
            <ArrowRight size={14} />
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default InterviewEnded;
