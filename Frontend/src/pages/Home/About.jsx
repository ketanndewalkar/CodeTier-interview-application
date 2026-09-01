import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export default function About() {
  const navigate = useNavigate();
  const { user, roleRoute } = useUserStore();

  const handleCtaClick = () => {
    if (user && roleRoute[user.role]) {
      navigate(roleRoute[user.role]);
    } else {
      navigate('/signup');
    }
  };

  const featureCards = [
    {
      tag: "Project Guide",
      title: "Faculty Advisor",
      role: "Guide Teacher",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
      env: "Academic & Tech Guidance"
    },
    {
      tag: "Lead Developer",
      title: "Core Engineer",
      role: "Project Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
      env: "Full-Stack & Docker Sandbox"
    },
    {
      tag: "R & D",
      title: "System Specialist",
      role: "Research",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
      env: "Benchmarking & Architecture"
    },
    {
      tag: "Project Support",
      title: "Team Contributor",
      role: "Assistant Member",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
      env: "Technical Assistance & QA"
    }
  ];

  return (
    <div className="bg-[#05040a] text-white min-h-screen pt-36 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden font-sans selection:bg-[#6c4f91] selection:text-white">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#6c4f91]/10 rounded-full blur-[180px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">

        {/* HERO SECTION (Header & Statement matching layout attachment) */}
        <div className="max-w-4xl text-left space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.06] tracking-tight text-white"
          >
            A Technical Hub for <br />
            <span className="hero-serif text-[#eedcff] italic font-normal">Developers</span> to Connect, <br />
            Thrive, and Evolve!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-white/60 font-light max-w-2xl leading-relaxed"
          >
            A container-backed platform for candidates, interviewers, and organizations to connect, collaborate, solve real-world problems, and showcase technical talent.
          </motion.p>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-2"
          >
            <button
              onClick={handleCtaClick}
              className="px-8 py-3.5 bg-[#6c4f91] hover:bg-[#835cb3] text-white font-bold text-xs rounded-xl uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#6c4f91]/30 inline-flex items-center gap-2 group"
            >
              <span>{user ? 'Go to Dashboard' : 'Join Platform'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>


        {/* FEATURED CARDS GRID (4 Tall Portrait Cards matching attachment layout) */}
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {featureCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#100c18] border border-white/10 hover:border-[#6c4f91]/60 transition-all shadow-xl flex flex-col"
              >
                {/* Image Container with Tag */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100c18] via-transparent to-transparent opacity-90" />
                  
                  {/* Tag Pill */}
                  <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider">
                    {card.tag}
                  </span>
                </div>

                {/* Card Meta Content */}
                <div className="p-5 pt-3 bg-[#100c18] border-t border-white/5 space-y-1 text-left">
                  <h3 className="text-base font-bold text-white group-hover:text-[#eedcff] transition-colors">{card.title}</h3>
                  <p className="text-xs text-white/50 font-medium">{card.role}</p>
                  <div className="pt-2 flex items-center gap-1.5 text-[10px] text-[#c084fc] font-mono">
                    <Terminal className="w-3 h-3" />
                    <span>{card.env}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


        {/* MISSION STATEMENT (Bottom section matching attachment layout) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#0e0a16] border border-white/10 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden"
        >
          {/* Accent Glow */}
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#6c4f91]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-4xl text-left space-y-4">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-normal leading-[1.15] text-white tracking-tight">
              We believe technical hiring grows stronger when it's transparent. That's why we built a trusted space where ideas turn into collaborations, and assessments turn into impact.
            </h2>
          </div>
        </motion.div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pt-4 text-center"
        >
          <button
            onClick={handleCtaClick}
            className="px-10 py-4 bg-[#6c4f91] hover:bg-[#835cb3] text-white font-bold text-xs rounded-xl uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-[#6c4f91]/20 inline-flex items-center gap-3 hover:scale-[1.02]"
          >
            <span>Start Building with CodeTier</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>
    </div>
  );
}
