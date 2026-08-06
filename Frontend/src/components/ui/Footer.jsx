

export default function Footer() {
  return (
    <footer className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-12 border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <img src="./logo.png" className="h-8 w-auto object-contain brightness-0" />

          <span className="font-code text-[10px] text-white/40 tracking-widest uppercase">
            © 2024 CODETIER. ALL RIGHTS RESERVED.
          </span>
        </div>

        {/* Right Section Links */}
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="text-[10px] font-code text-white/40 hover:text-[#eedcff] transition-colors tracking-widest uppercase">
            PRIVACY POLICY
          </a>
          <a href="#" className="text-[10px] font-code text-white/40 hover:text-[#eedcff] transition-colors tracking-widest uppercase">
            TERMS OF SERVICE
          </a>
          <a href="#" className="text-[10px] font-code text-white/40 hover:text-[#eedcff] transition-colors tracking-widest uppercase">
            SECURITY
          </a>
        </div>

      </div>
    </footer>
  );
}
