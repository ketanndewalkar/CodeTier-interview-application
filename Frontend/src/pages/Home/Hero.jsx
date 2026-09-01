import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useUserStore } from '../../store/userStore';

export default function Hero() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const { roleRoute, user } = useUserStore(state => state);
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for coordinated text entrance animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Animate headline words
      const words = headlineRef.current?.querySelectorAll('.gsap-word');
      if (words && words.length > 0) {
        tl.fromTo(
          words,
          { y: 35, opacity: 0, filter: 'blur(8px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.07 }
        );
      }

      // Animate subtitle
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0, filter: 'blur(4px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7 },
          '-=0.4'
        );
      }

      // Animate CTA buttons
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6 },
          '-=0.3'
        );
      }
    }, containerRef);

    // Mouse proximity font weight & scale animation
    const chars = containerRef.current?.querySelectorAll('.proximity-char');
    const radius = 200; // Radius of influence in pixels

    const handleMouseMove = (e) => {
      if (!chars || chars.length === 0) return;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      chars.forEach((char) => {
        const rect = char.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        const dist = Math.hypot(mouseX - charX, mouseY - charY);

        if (dist < radius) {
          const p = 1 - dist / radius; // Proximity ratio
          const weight = Math.round(400 + p * 300); // 400 -> 700
          const scale = 1 + p * 0.1;
          const translateY = -p * 4;

          char.style.fontWeight = weight;
          char.style.transform = `translateY(${translateY}px) scale(${scale})`;
        } else {
          char.style.fontWeight = 400;
          char.style.transform = 'none';
        }
      });
    };

    const handleMouseLeave = () => {
      if (!chars) return;
      chars.forEach((char) => {
        char.style.fontWeight = 400;
        char.style.transform = 'none';
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    const heroEl = containerRef.current;
    if (heroEl) {
      heroEl.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
      if (heroEl) {
        heroEl.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Helper function to render text with split interactive character spans
  const renderInteractiveText = (text, isItalic = false) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className={`proximity-char inline-block origin-center select-none ${isItalic ? 'hero-serif text-[#eedcff] italic' : 'text-white'
          }`}
        style={{ fontWeight: 400 }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-12 py-24 sm:py-32 overflow-hidden bg-black">

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-85 z-0"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Subtle Vignette & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black pointer-events-none z-[1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-[#6c4f91]/30 rounded-full blur-[100px] sm:blur-[160px] pointer-events-none z-[1]" />

      <div
        ref={containerRef}
        className="max-w-5xl mx-auto space-y-6 sm:space-y-10 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto"
      >

        {/* Headline with split interactive characters & GSAP entrance words */}
        <h1
          ref={headlineRef}
          className="hero-main-title text-white text-3xl sm:text-6xl lg:text-7xl leading-[1.12] sm:leading-[1.02] tracking-tight font-normal text-center max-w-4xl mx-auto cursor-default"
        >
          <span className="gsap-word inline-block mr-[0.25em]">
            {renderInteractiveText('Transform')}
          </span>
          <span className="gsap-word inline-block mr-[0.25em]">
            {renderInteractiveText('Hiring')}
          </span>
          <span className="gsap-word inline-block mr-[0.25em]">
            {renderInteractiveText('Into')}
          </span>
          <span className="gsap-word inline-block mr-[0.25em]">
            {renderInteractiveText('A')}
          </span>
          <span className="gsap-word inline-block mr-[0.25em]">
            {renderInteractiveText('Real Engineering', true)}
          </span>
          <span className="gsap-word inline-block">
            {renderInteractiveText('Experience')}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-body text-white/70 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed font-light px-2 text-center opacity-0 cursor-default"
        >
          Conduct technical interviews with live coding, real-time
          collaboration, automated evaluation, and intelligent scheduling.
        </p>

        {/* Action Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-4 sm:pt-6 w-full max-w-md sm:max-w-none mx-auto opacity-0"
        >
          <button
            onClick={() => navigate(roleRoute[user.role])}
            className="w-full sm:w-auto bg-white text-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-sm tracking-widest flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-[0.98] transition-all group shadow-xl shadow-white/10 uppercase cursor-pointer"
          >
            <span>START INTERVIEW</span>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            </div>
          </button>

          <button
            onClick={() => {
              const element = document.getElementById('interview-lifecycle');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate('/candidate/dashboard');
              }
            }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-white/20 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-white/5 transition-colors uppercase tracking-widest backdrop-blur-sm cursor-pointer"
          >
            EXPLORE PLATFORM
          </button>
        </div>
      </div>
    </section>
  );
}

