import { motion } from 'motion/react';

export default function CTASection() {
  return (
    <section className="py-16 sm:py-28 px-3 sm:px-6 lg:px-12 bg-black">
      <div className="max-w-6xl mx-auto py-14 sm:py-24 px-6 sm:px-12 rounded-3xl sm:rounded-[3.5rem] border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm relative overflow-hidden text-center">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#6c4f91]/20 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-8 sm:space-y-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="display-serif text-white text-3xl sm:text-6xl lg:text-7xl max-w-4xl mx-auto leading-[1.15] sm:leading-[1.08] font-normal"
          >
            Ready to <span className="hero-serif text-[#eedcff] italic">elevate</span> your engineering bar?
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 max-w-md sm:max-w-none mx-auto"
          >
            <button className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-[#baf2ff] text-[#00363f] font-bold text-xs rounded-xl hover:shadow-[0_0_30px_rgba(186,242,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">
              REQUEST DEMO
            </button>
            <button className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 border border-white/20 text-white font-bold text-xs rounded-xl hover:bg-white/5 transition-colors uppercase tracking-widest">
              VIEW DOCUMENTATION
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
