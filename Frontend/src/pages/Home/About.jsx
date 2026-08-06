import React from 'react';
import { Award, Shield, Cpu, Users, ArrowRight, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Cpu,
      title: "AI-Powered Intelligence",
      description: "Harness modern evaluation frameworks and automated grading to ensure precise, unbiased assessment of technical capabilities.",
      color: "text-[#c084fc] bg-[#2a1d3f] border-[#7c3aed]/20"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Secure workspace environments with anti-cheat mechanisms, screen monitoring, and protected candidate test flows.",
      color: "text-emerald-400 bg-emerald-950/50 border-emerald-500/20"
    },
    {
      icon: Users,
      title: "Collaborative Workspaces",
      description: "Bring recruiters, hiring managers, and interviewers onto a single platform with synchronous coding pads and shared notes.",
      color: "text-blue-400 bg-blue-950/50 border-blue-500/20"
    },
    {
      icon: Target,
      title: "Precision Matching",
      description: "Build custom assessment pipelines tailored to specific engineering roles, ensuring high-signal evaluation.",
      color: "text-amber-400 bg-amber-950/50 border-amber-500/20"
    }
  ];

  const stats = [
    { value: "10x", label: "Faster Hiring Cycle" },
    { value: "150k+", label: "Interviews Conducted" },
    { value: "98.4%", label: "Candidate Satisfaction" },
    { value: "40%", label: "Reduction in Cost-per-Hire" }
  ];

  return (
    <div className="bg-[#080808] text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c122e] border border-[#7c3aed]/30 text-xs font-semibold text-[#c084fc] tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Revolutionizing the Way <span className="bg-gradient-to-r from-[#a855f7] to-[#eedcff] bg-clip-text text-transparent">Tech Teams Hire</span>
          </h1>
          <p className="text-base text-purple-200/70 font-normal leading-relaxed">
            CodeTier is an all-in-one technical interview and assessment platform designed to help companies evaluate engineering talent fairly, efficiently, and at scale.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#110e17]/60 border border-white/5 p-8 sm:p-10 rounded-3xl backdrop-blur-md">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#c084fc] font-mono">{s.value}</div>
              <div className="text-xs text-white/50 font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Core Values Section */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Built on Engineering Integrity</h2>
            <p className="text-sm text-purple-200/50 max-w-2xl mx-auto">
              We design features that balance high-signal recruiter controls with an outstanding developer-centric candidate experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-[#110e17] border border-white/10 shadow-xl flex items-start gap-4 hover:border-[#7c3aed]/40 transition-all group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${v.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h3 className="text-sm font-bold text-white group-hover:text-[#c084fc] transition-colors">{v.title}</h3>
                    <p className="text-xs text-purple-200/60 leading-relaxed font-normal">{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA / Footer Section */}
        <div className="p-10 sm:p-12 rounded-3xl bg-gradient-to-r from-[#170e28] to-[#0c0914] border border-[#7c3aed]/20 flex flex-col md:flex-row items-center justify-between gap-8 text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7c3aed]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-3 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Ready to upgrade your engineering pipeline?</h3>
            <p className="text-xs sm:text-sm text-purple-200/60 leading-relaxed font-normal">
              Join hundreds of leading technical organizations scheduling assessments and running collaborative code interviews today.
            </p>
          </div>
          <div className="flex gap-4 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#7c3aed]/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
