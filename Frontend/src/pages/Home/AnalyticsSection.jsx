import { motion } from 'motion/react';

export default function AnalyticsSection() {
  return (
    <section className="px-3 sm:px-6 lg:px-12 py-12 sm:py-20 md:py-24 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-10 md:p-16 shadow-[0_24px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#6c4f91]/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 items-start relative z-10">
            
            {/* Card 1: Real-Time Coding Environment */}
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center justify-between">
                <span className="font-code text-[10px] sm:text-[11px] text-[#eedcff] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold">
                  LIVE CODE INTERVIEWS // 01
                </span>
                <span className="material-symbols-outlined text-white/20 text-xl sm:text-2xl">
                  code
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-white/40 font-code text-[9px] sm:text-[10px] tracking-widest uppercase">
                  Real-Time Collaborative Coding
                </h3>
                <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                  Watch candidates solve real problems in a live, multi-language code editor — with instant execution and built-in test cases.
                </p>
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
                  No more whiteboard guesswork. Evaluate actual coding ability as it happens, with full syntax highlighting and auto-completion.
                </p>
              </div>

              {/* Bar Chart Visual */}
              <div className="h-28 sm:h-32 flex items-end gap-2 sm:gap-2.5 pt-2">
                <motion.div initial={{ height: '0%' }} whileInView={{ height: '60%' }} transition={{ duration: 0.8 }} className="flex-1 bg-white/5 rounded-t-lg" />
                <motion.div initial={{ height: '0%' }} whileInView={{ height: '80%' }} transition={{ duration: 0.8, delay: 0.1 }} className="flex-1 bg-white/10 rounded-t-lg" />
                <motion.div initial={{ height: '0%' }} whileInView={{ height: '70%' }} transition={{ duration: 0.8, delay: 0.2 }} className="flex-1 bg-white/5 rounded-t-lg" />
                <motion.div initial={{ height: '0%' }} whileInView={{ height: '90%' }} transition={{ duration: 0.8, delay: 0.3 }} className="flex-1 bg-white/15 rounded-t-lg" />
                <motion.div initial={{ height: '0%' }} whileInView={{ height: '75%' }} transition={{ duration: 0.8, delay: 0.4 }} className="flex-1 bg-[#6c4f91]/40 rounded-t-lg" />
                <motion.div initial={{ height: '0%' }} whileInView={{ height: '100%' }} transition={{ duration: 0.8, delay: 0.5 }} className="flex-1 bg-[#6c4f91] rounded-t-lg shadow-[0_0_20px_rgba(108,79,145,0.6)]" />
              </div>

              {/* Badge Bottom */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#eedcff] text-sm shrink-0">
                  terminal
                </span>
                <span className="text-[9px] font-code text-white/60 uppercase tracking-wider">
                  Multi-Language Support · Instant Code Execution ✓
                </span>
              </div>
            </div>

            {/* Card 2: Streamlined Hiring Process */}
            <div className="space-y-6 sm:space-y-8 py-8 lg:py-0 border-y lg:border-y-0 lg:border-x border-white/10 lg:px-12">
              <div className="flex items-center justify-between">
                <span className="font-code text-[10px] sm:text-[11px] text-[#eedcff] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold">
                  STREAMLINED EVALUATION // 02
                </span>
                <span className="material-symbols-outlined text-white/20 text-xl sm:text-2xl">
                  timer
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-white/40 font-code text-[9px] sm:text-[10px] tracking-widest uppercase">
                  End-to-End Interview Pipeline
                </h3>
                <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                  Replace fragmented tools with one unified platform — from scheduling interviews to generating structured evaluations.
                </p>
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
                  Dramatically cut your time-to-decision with automated rubric scoring and side-by-side candidate comparisons.
                </p>
              </div>

              {/* Progress Bar Visual */}
              <div className="p-4 sm:p-6 bg-white/[0.03] rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center text-[9px] font-code text-white/30">
                  <span>UNSTRUCTURED INTERVIEWS</span>
                  <span className="text-[#eedcff]">STRUCTURED SCORECARD</span>
                </div>
                <div className="w-full h-2 bg-black rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div 
                    initial={{ width: '0%' }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1.2 }}
                    className="h-full bg-[#6c4f91] rounded-full shadow-[0_0_12px_rgba(108,79,145,0.7)]" 
                  />
                </div>
              </div>

              {/* Badge Bottom */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00ec3b] text-sm shrink-0">
                  shield
                </span>
                <span className="text-[9px] font-code text-white/60 uppercase tracking-wider">
                  Sandboxed Execution · Container Isolated ✓
                </span>
              </div>
            </div>

            {/* Card 3: AI-Powered Rubric Evaluation */}
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center justify-between">
                <span className="font-code text-[10px] sm:text-[11px] text-[#eedcff] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold">
                  SMART RUBRICS // 03
                </span>
                <span className="material-symbols-outlined text-white/20 text-xl sm:text-2xl">
                  fact_check
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-white/40 font-code text-[9px] sm:text-[10px] tracking-widest uppercase">
                  AI-Powered Evaluation
                </h3>
                <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
                  Every submission is scored against customizable rubrics — measuring problem-solving, code quality, and efficiency automatically.
                </p>
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
                  Eliminate bias with consistent, data-driven assessments that give every candidate a fair and transparent evaluation.
                </p>
              </div>

              {/* Console Box Visual */}
              <div className="font-code text-[10px] sm:text-[11px] text-white/40 space-y-2 bg-black/60 p-4 sm:p-5 rounded-2xl border border-white/5 overflow-x-auto">
                <div className="flex gap-2 sm:gap-3 items-center whitespace-nowrap">
                  <span className="text-[#6c4f91] font-bold">&gt;</span>
                  <span className="text-white/70">ANALYZING_PROBLEM_SOLVING... [DONE]</span>
                </div>
                <div className="flex gap-2 sm:gap-3 items-center whitespace-nowrap">
                  <span className="text-[#6c4f91] font-bold">&gt;</span>
                  <span className="text-white/70">EVALUATING_CODE_QUALITY... [DONE]</span>
                </div>
                <div className="flex gap-2 sm:gap-3 items-center whitespace-nowrap">
                  <span className="text-[#6c4f91] font-bold">&gt;</span>
                  <span className="text-white/70">GENERATING_RUBRIC_REPORT... [DONE]</span>
                </div>
              </div>

              {/* Badge Bottom */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#eedcff] text-sm shrink-0">
                  insights
                </span>
                <span className="text-[9px] font-code text-white/60 uppercase tracking-wider">
                  Bias-Free Rubric Reports · Instant Insights ✓
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
