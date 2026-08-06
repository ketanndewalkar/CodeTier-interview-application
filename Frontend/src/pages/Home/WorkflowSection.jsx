import { motion, useScroll } from 'motion/react';
import { useRef } from 'react';
import {
  FaArrowsRotate,
  FaBrain,
  FaCircleCheck,
  FaFileLines,
  FaFolderOpen,
  FaPlay,
  FaShieldHalved,
  FaTerminal,
  FaUserShield,
} from 'react-icons/fa6';

function StepCircle() {
  return (
    <div className="absolute left-4 md:left-8 top-2 sm:top-2.5 -translate-x-1/2 flex items-center justify-center z-10">
      {/* Outer pulsing ring when scrolled into view */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{
          opacity: [0, 0.8, 0],
          scale: [0.8, 2.2, 3.2],
        }}
        viewport={{ amount: 0.4, margin: "-10% 0px -10% 0px" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
        className="absolute w-5 h-5 rounded-full bg-[#a855f7]/60 pointer-events-none"
      />

      {/* Main Animated Circle Node */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0.4, backgroundColor: '#4a3368' }}
        whileInView={{ 
          scale: [0.7, 1.4, 1.25], 
          opacity: 1,
          backgroundColor: '#a855f7',
          boxShadow: "0 0 22px 5px rgba(168, 85, 247, 0.95)"
        }}
        viewport={{ amount: 0.4, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white/70 flex items-center justify-center relative cursor-pointer"
      >
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ amount: 0.4, margin: "-10% 0px -10% 0px" }}
          className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" 
        />
      </motion.div>
    </div>
  );
}

export default function WorkflowSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 50%"]
  });

  return (
    <section id="interview-lifecycle" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto" ref={containerRef}>
        
        {/* Section Title */}
        <div className="mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="display-serif text-white text-4xl sm:text-5xl lg:text-6xl mb-6 font-normal"
          >
            The Interview <span className="hero-serif text-[#eedcff] italic">Lifecycle</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-body text-white/60 max-w-2xl text-base sm:text-lg leading-relaxed"
          >
            A seamless, automated workflow designed for modern engineering teams.
          </motion.p>
        </div>

        {/* Steps Container with Timeline Track */}
        <div className="relative">
          {/* Vertical Track Line Background */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2" />

          {/* Dynamic Scroll-Filled Timeline Track Line */}
          <motion.div 
            style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
            className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6c4f91] via-[#a855f7] to-[#eedcff] shadow-[0_0_12px_rgba(168,85,247,0.8)] -translate-x-1/2 z-0"
          />

          <div className="space-y-20 sm:space-y-28 md:space-y-36">
            
            {/* STEP 01 */}
            <div className="relative pl-8 sm:pl-12 md:pl-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <StepCircle />
              
              <div className="space-y-5 sm:space-y-6">
                <span className="font-code text-[11px] text-[#eedcff] tracking-[0.2em] uppercase font-bold">
                  STEP 01
                </span>
                <h3 className="display-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-tight">
                  Find the perfect interview time automatically
                </h3>
                <p className="font-body text-white/60 text-sm sm:text-base leading-relaxed">
                  Our intelligent scheduling engine synchronizes availability across candidates and interviewers to find the optimal window for technical depth.
                </p>
                <button className="px-5 sm:px-6 py-2.5 sm:py-3 border border-white/20 text-white font-bold text-xs rounded-xl hover:bg-white/5 transition-colors uppercase tracking-widest">
                  CONFIGURE SCHEDULING
                </button>
              </div>

              {/* Step 1 Visual Mockup */}
              <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl h-72 sm:h-80 overflow-hidden flex items-center justify-center p-4 sm:p-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs p-5 sm:p-6 backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl shadow-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <FaArrowsRotate className="text-[#eedcff] text-sm animate-spin" />
                    <span className="text-[10px] font-code text-white/90 uppercase tracking-wider">
                      Analyzing availability...
                    </span>
                  </div>

                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-[10px] sm:text-[11px] text-white/70">
                      <FaCircleCheck className="text-[#00ec3b] text-xs shrink-0" />
                      Candidate availability
                    </li>
                    <li className="flex items-center gap-2 text-[10px] sm:text-[11px] text-white/70">
                      <FaCircleCheck className="text-[#00ec3b] text-xs shrink-0" />
                      Interviewer availability
                    </li>
                    <li className="flex items-center gap-2 text-[10px] sm:text-[11px] text-white/70">
                      <FaCircleCheck className="text-[#00ec3b] text-xs shrink-0" />
                      Technical expertise match
                    </li>
                    <li className="flex items-center gap-2 text-[10px] sm:text-[11px] text-white/70">
                      <FaCircleCheck className="text-[#00ec3b] text-xs shrink-0" />
                      Time optimization
                    </li>
                  </ul>

                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <div className="text-[10px] sm:text-[11px] font-bold text-[#eedcff] uppercase tracking-widest">
                      Monday, 2:00 PM
                    </div>
                    <div className="text-[10px] text-[#00ec3b] font-code font-bold">
                      96% Match
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 02 */}
            <div className="relative pl-8 sm:pl-12 md:pl-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <StepCircle />
              
              <div className="space-y-5 sm:space-y-6">
                <span className="font-code text-[11px] text-[#eedcff] tracking-[0.2em] uppercase font-bold">
                  STEP 02
                </span>
                <h3 className="display-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-tight">
                  Every interview starts with a ready-to-build workspace
                </h3>
                <p className="font-body text-white/60 text-sm sm:text-base leading-relaxed">
                  Before the interview begins, our platform automatically prepares a secure coding environment with the required tools, runtime, and workspace — allowing candidates to start solving problems instantly.
                </p>
                <button className="px-5 sm:px-6 py-2.5 sm:py-3 border border-white/20 text-white font-bold text-xs rounded-xl hover:bg-white/5 transition-colors uppercase tracking-widest">
                  EXPLORE WORKSPACE
                </button>
              </div>

              {/* Step 2 Visual Mockup */}
              <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl h-72 sm:h-80 overflow-hidden flex items-center justify-center p-3 sm:p-6">
                <div className="w-full h-full bg-black/60 rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
                  {/* Top Bar */}
                  <div className="h-9 bg-white/5 border-b border-white/10 flex items-center justify-between px-3 sm:px-4 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ec3b] animate-pulse" />
                      <span className="text-[8px] sm:text-[9px] font-code text-white/50 uppercase tracking-widest">
                        INITIALIZING
                      </span>
                    </div>
                  </div>

                  {/* Main Editor Body */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Explorer */}
                    <div className="w-24 sm:w-28 border-r border-white/5 p-2.5 sm:p-3 space-y-2 bg-black/30 shrink-0">
                      <div className="text-[8px] text-white/30 uppercase font-bold tracking-widest mb-2">
                        Explorer
                      </div>
                      <div className="flex items-center gap-1.5 text-white/60">
                        <FaFolderOpen className="text-[12px]" />
                        <span className="text-[10px]">src</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#eedcff] ml-2">
                        <FaFileLines className="text-[12px]" />
                        <span className="text-[10px]">main.cpp</span>
                      </div>
                    </div>

                    {/* Code Panel */}
                    <div className="flex-1 p-3 sm:p-4 font-code text-[10px] sm:text-[11px] space-y-1 bg-black/50 overflow-x-auto">
                      <div className="text-white/40 whitespace-nowrap">
                        <span className="text-[#eedcff]">#include</span> &lt;iostream&gt;
                      </div>
                      <div className="text-white/40 whitespace-nowrap">
                        <span className="text-[#eedcff]">int</span> main() {'{'}
                      </div>
                      <div className="text-white/80 pl-4 whitespace-nowrap">
                        std::cout &lt;&lt; <span className="text-[#00ec3b]">"Ready."</span>;
                      </div>
                      <div className="text-white/40">{'}'}</div>

                      <div className="mt-4 sm:mt-6 pt-3 border-t border-white/10 flex items-center gap-2 text-[#00ec3b]">
                        <FaCircleCheck className="text-xs shrink-0" />
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold">
                          Interview Environment Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="h-8 bg-black/80 border-t border-white/10 flex items-center px-3 sm:px-4 justify-between text-[8px] sm:text-[9px] font-code text-white/40 shrink-0">
                    <span>Terminal Ready</span>
                    <div className="flex gap-2 sm:gap-4">
                      <span className="text-[#00ec3b]">✓ Runtime</span>
                      <span className="text-[#00ec3b]">✓ Repo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 03 */}
            <div className="relative pl-8 sm:pl-12 md:pl-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <StepCircle />
              
              <div className="space-y-5 sm:space-y-6">
                <span className="font-code text-[11px] text-[#eedcff] tracking-[0.2em] uppercase font-bold">
                  STEP 03
                </span>
                <h3 className="display-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-tight">
                  Experience interviews like real engineering sessions
                </h3>
                <p className="font-body text-white/60 text-sm sm:text-base leading-relaxed">
                  Conduct realistic technical interviews with live video, collaborative coding, real-time communication, and shared development tools — all inside one unified engineering workspace.
                </p>
                <button className="px-5 sm:px-6 py-2.5 sm:py-3 border border-white/20 text-white font-bold text-xs rounded-xl hover:bg-white/5 transition-colors uppercase tracking-widest">
                  EXPLORE INTERVIEW ROOM
                </button>
              </div>

              {/* Step 3 Visual Mockup */}
              <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl h-[420px] sm:h-[460px] overflow-hidden flex flex-col shadow-2xl">
                {/* Header Bar */}
                <div className="p-2.5 sm:p-3.5 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-black/50 px-2 sm:px-2.5 py-1 rounded-lg border border-white/10">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#00ec3b]" />
                      <span className="text-[9px] sm:text-[10px] font-bold text-white/90 uppercase">Candidate</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-black/50 px-2 sm:px-2.5 py-1 rounded-lg border border-white/10">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#00ec3b]" />
                      <span className="text-[9px] sm:text-[10px] font-bold text-white/90 uppercase">Interviewer</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] sm:text-[9px] font-code text-[#00ec3b] uppercase tracking-widest">
                      Connected
                    </span>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 flex overflow-hidden relative">
                  <div className="hidden sm:block w-28 border-r border-white/5 p-3 space-y-2 bg-black/30 shrink-0">
                    <div className="text-[8px] text-white/30 uppercase font-bold tracking-widest mb-2">
                      Explorer
                    </div>
                    <div className="flex items-center gap-1.5 text-white/50">
                      <FaFolderOpen className="text-[12px]" />
                      <span className="text-[10px]">src</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#eedcff] ml-2">
                      <FaFileLines className="text-[12px]" />
                      <span className="text-[10px]">main.cpp</span>
                    </div>
                  </div>

                  <div className="flex-1 p-3 sm:p-5 font-code text-[10px] sm:text-[11px] relative bg-black/60 space-y-1 overflow-x-auto">
                    <div className="text-white/40 whitespace-nowrap">
                      <span className="text-[#eedcff]">#include</span> &lt;iostream&gt;
                    </div>
                    <div className="text-white/40 whitespace-nowrap">
                      <span className="text-[#eedcff]">int</span> main() {'{'}
                    </div>
                    <div className="text-white/70 pl-4 whitespace-nowrap">
                      std::vector&lt;<span className="text-[#eedcff]">int</span>&gt; data = {'{'}<span className="text-[#00ec3b]">1, 2, 3, 4, 5</span>{'}'};
                    </div>
                    
                    {/* Candidate Cursor Line */}
                    <div className="text-white/70 pl-4 relative whitespace-nowrap">
                      for (<span className="text-[#eedcff]">auto</span>&amp; x : data) {'{'}
                    </div>

                    <div className="text-white/70 pl-8 whitespace-nowrap">
                      std::cout &lt;&lt; x &lt;&lt; std::endl;
                    </div>

                    <div className="text-white/70 pl-4 relative whitespace-nowrap">
                      {'}'}
                    </div>

                    <div className="text-white/40">{'}'}</div>

                    {/* Floating Comment Box */}
                    <div className="mt-4 bg-[#6c4f91]/30 border border-[#6c4f91]/50 p-2.5 rounded-xl backdrop-blur-md max-w-[200px] shadow-2xl">
                      <p className="text-[9px] sm:text-[10px] text-white/90 leading-tight font-body">
                        Can we optimize this approach?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="h-9 sm:h-10 bg-black/90 border-t border-white/10 flex items-center px-3 sm:px-4 justify-between shrink-0">
                  <span className="text-[9px] sm:text-[10px] font-code text-white/50">$ npm test</span>
                  <span className="text-[8px] sm:text-[9px] font-code text-[#00ec3b]/80 uppercase tracking-widest">
                    Terminal Ready
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 04 */}
            <div className="relative pl-8 sm:pl-12 md:pl-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <StepCircle />
              
              <div className="space-y-5 sm:space-y-6">
                <span className="font-code text-[11px] text-[#eedcff] tracking-[0.2em] uppercase font-bold">
                  STEP 04
                </span>
                <h3 className="display-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-tight">
                  Run real code in a secure environment
                </h3>
                <p className="font-body text-white/60 text-sm sm:text-base leading-relaxed">
                  Evaluate candidates through real coding execution. Every solution runs inside an isolated environment with automated compilation, testing, and instant feedback.
                </p>
                <button className="px-5 sm:px-6 py-2.5 sm:py-3 border border-white/20 text-white font-bold text-xs rounded-xl hover:bg-white/5 transition-colors uppercase tracking-widest">
                  EXPLORE EXECUTION ENGINE
                </button>
              </div>

              {/* Step 4 Visual Mockup */}
              <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl h-[420px] sm:h-[460px] overflow-hidden flex flex-col shadow-2xl">
                <div className="p-3 sm:p-3.5 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] sm:text-[10px] font-code text-white/50 uppercase tracking-widest">
                      Execution Engine
                    </span>
                  </div>
                  <button className="bg-[#6c4f91] text-white px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-[#6c4f91]/90 transition-all shadow-md">
                    <FaPlay className="text-xs" /> RUN
                  </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  <div className="flex-1 flex flex-col border-r border-white/5 min-w-0">
                    <div className="flex-1 p-3 sm:p-5 font-code text-[10px] sm:text-[11px] bg-black/60 space-y-2 overflow-x-auto">
                      <div className="text-white/40 whitespace-nowrap">
                        <span className="text-[#eedcff]">#include</span> &lt;gtest/gtest.h&gt;
                      </div>
                      <div className="text-white/40 whitespace-nowrap">
                        <span className="text-[#eedcff]">TEST</span>(SolutionTest, HandlesPositiveInput) {'{'}
                      </div>
                      <div className="text-white/70 pl-4 whitespace-nowrap">
                        <span className="text-[#eedcff]">EXPECT_EQ</span>(solve(<span className="text-[#00ec3b]">5</span>), <span className="text-[#00ec3b]">120</span>);
                      </div>
                      <div className="text-white/40">{'}'}</div>

                      <div className="mt-3 space-y-1.5 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-white/50">
                          <FaCircleCheck className="text-[#00ec3b] text-xs shrink-0" /> Code Submitted
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-[#eedcff]">
                          <FaArrowsRotate className="text-xs animate-spin shrink-0" /> Running Tests...
                        </div>
                      </div>
                    </div>

                    {/* Output Terminal */}
                    <div className="h-24 sm:h-28 bg-black/90 p-3 sm:p-4 font-code text-[9px] sm:text-[10px] border-t border-white/10 shrink-0">
                      <div className="text-white/40 mb-0.5">[Terminal Output]</div>
                      <div className="text-[#00ec3b]">✓ Test Case 1: Passed (12ms)</div>
                      <div className="text-[#00ec3b]">✓ Test Case 2: Passed (45ms)</div>
                    </div>
                  </div>

                  {/* Sidebar stats */}
                  <div className="hidden sm:block w-36 sm:w-44 bg-black/30 p-3 sm:p-4 space-y-4 shrink-0">
                    <div className="space-y-2">
                      <div className="text-[8px] text-white/30 uppercase font-bold tracking-widest">Environment</div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[9px] text-white/80">
                          <FaTerminal className="text-[#eedcff] text-xs" /> C++ 20
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-white/80">
                          <FaShieldHalved className="text-[#00ec3b] text-xs" /> Container
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[8px] text-white/30 uppercase font-bold tracking-widest">Test Results</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="text-white/60">Passed</span>
                          <span className="text-[#00ec3b] font-bold">8/10</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#00ec3b] w-[80%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 05 */}
            <div className="relative pl-8 sm:pl-12 md:pl-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <StepCircle />
              
              <div className="space-y-5 sm:space-y-6">
                <span className="font-code text-[11px] text-[#eedcff] tracking-[0.2em] uppercase font-bold">
                  STEP 05
                </span>
                <h3 className="display-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-tight">
                  Understand how candidates think
                </h3>
                <p className="font-body text-white/60 text-sm sm:text-base leading-relaxed">
                  Our AI analyzes every aspect of the interview — from coding decisions and problem-solving approach to communication and technical quality — helping organizations make smarter hiring decisions.
                </p>
                <button className="px-5 sm:px-6 py-2.5 sm:py-3 border border-white/20 text-white font-bold text-xs rounded-xl hover:bg-white/5 transition-colors uppercase tracking-widest">
                  EXPLORE AI INSIGHTS
                </button>
              </div>

              {/* Step 5 Visual Mockup */}
              <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl h-[420px] sm:h-[460px] overflow-hidden flex flex-col shadow-2xl">
                <div className="p-3 sm:p-3.5 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                  <div className="flex items-center gap-2">
                    <FaBrain className="text-[#eedcff] text-sm" />
                    <span className="text-[10px] font-code text-white/90 uppercase tracking-wider">
                      AI Interview Analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ec3b] animate-pulse" />
                    <span className="text-[8px] sm:text-[9px] font-code text-white/40 uppercase tracking-widest">
                      Analyzing...
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  {/* Left Pipeline Sidebar */}
                  <div className="hidden sm:block w-40 sm:w-44 border-r border-white/5 p-3 sm:p-4 space-y-4 bg-black/30 shrink-0">
                    <div className="text-[8px] text-white/30 uppercase font-bold tracking-widest">Pipeline</div>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-[10px] text-white/70">
                        <FaCircleCheck className="text-[#00ec3b] text-xs shrink-0" /> Coding Approach
                      </li>
                      <li className="flex items-center gap-2 text-[10px] text-white/70">
                        <FaCircleCheck className="text-[#00ec3b] text-xs shrink-0" /> Problem Solving
                      </li>
                      <li className="flex items-center gap-2 text-[10px] text-white/70">
                        <FaCircleCheck className="text-[#00ec3b] text-xs shrink-0" /> Communication
                      </li>
                    </ul>

                    <div className="pt-3 border-t border-white/10">
                      <div className="p-2.5 rounded-xl bg-[#6c4f91]/20 border border-[#6c4f91]/40">
                        <div className="text-[8px] text-white/40 uppercase mb-1">Overall Score</div>
                        <div className="text-xl sm:text-2xl font-bold text-white">88<span className="text-xs text-white/40">/100</span></div>
                        <div className="text-[8px] text-[#00ec3b] mt-1 font-bold">Strong Fit</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Insights Detail */}
                  <div className="flex-1 p-4 sm:p-5 space-y-4 sm:space-y-5 bg-black/50 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-white/60">
                          <span>Problem Solving</span><span>84%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#6c4f91] w-[84%]" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-white/60">
                          <span>Code Quality</span><span>91%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#6c4f91] w-[91%]" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-white/60">
                          <span>Communication</span><span>78%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#6c4f91] w-[78%]" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-white/60">
                          <span>Technical Depth</span><span>86%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#6c4f91] w-[86%]" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-white/90 uppercase tracking-wider">
                        Candidate Strengths
                      </div>
                      <ul className="space-y-1.5">
                        <li className="flex gap-2 text-[9px] sm:text-[10px] text-white/70">
                          <span className="text-[#eedcff]">•</span> Efficient use of data structures for O(n) complexity
                        </li>
                        <li className="flex gap-2 text-[9px] sm:text-[10px] text-white/70">
                          <span className="text-[#eedcff]">•</span> Proactive clarification of edge cases before coding
                        </li>
                        <li className="flex gap-2 text-[9px] sm:text-[10px] text-white/70">
                          <span className="text-[#eedcff]">•</span> Strong modularization and naming conventions
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-[8px] text-white/40 uppercase">Confidence Level</div>
                        <div className="text-[10px] sm:text-[11px] font-bold text-white">High (94%)</div>
                      </div>
                      <FaUserShield className="text-[#00ec3b]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
