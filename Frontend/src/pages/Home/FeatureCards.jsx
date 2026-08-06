import { motion } from 'motion/react';
import { FaBrain, FaCode, FaUsers } from 'react-icons/fa6';

export default function FeatureCards() {
  const features = [
    {
      icon: <FaCode />, 
      title: 'Instant Interview Workspace',
      description: 'Automatically create isolated coding environments for every interview with pre-configured runtimes, dependencies, and project workspaces — allowing candidates to start solving problems instantly.'
    },
    {
      icon: <FaUsers />, 
      title: 'Real-Time Engineering Collaboration',
      description: 'Conduct interviews inside a shared workspace where candidates and interviewers communicate, review code, and collaborate through live video, audio, and synchronized editing.'
    },
    {
      icon: <FaBrain />, 
      title: 'AI-Powered Technical Insights',
      description: 'Analyze coding decisions, problem-solving approach, and technical communication to generate meaningful evaluation insights and smarter hiring decisions.'
    }
  ];

  return (
    <section className="py-16 sm:py-28 px-4 sm:px-6 lg:px-12 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-[#ece6f1] border border-[#6c4f91]/10 hover:border-[#6c4f91]/30 transition-all hover:-translate-y-1.5 group shadow-sm text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#6c4f91]/10 flex items-center justify-center mb-6 sm:mb-10 group-hover:bg-[#6c4f91]/20 transition-colors">
                  <span className="text-[#6c4f91] text-2xl sm:text-3xl">
                    {feature.icon}
                  </span>
                </div>

                <h4 className="display-serif text-xl sm:text-2xl text-[#1a1c1d] mb-3 sm:mb-4 font-normal leading-snug">
                  {feature.title}
                </h4>

                <p className="text-[#4a454f] leading-relaxed font-body text-xs sm:text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
