import Image from "next/image";

export const metadata = {
  title: "YUBBY DUBBY | Under Development",
  description: "Our new luxury minimal e-commerce structure is currently under development. Stay tuned.",
};

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-radial from-[#B1F310]/10 via-transparent to-transparent blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl flex justify-between items-center py-4 z-10">
        <div className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500">
          EST. 2026
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-col items-center justify-center max-w-lg text-center space-y-8 z-10 my-auto">
        <div className="relative w-72 h-24 mb-4">
          <Image
            src="/LOGOO.png"
            alt="Yubby Dubby Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[20px] p-8 md:p-12 space-y-6 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B1F310]/20 bg-[#B1F310]/5 text-xs text-[#B1F310] tracking-widest uppercase font-bold">
            <span className="w-2 h-2 rounded-full bg-[#B1F310] animate-ping" />
            Under Construction
          </div>

          <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter leading-none font-heading">
            A NEW STRUCTURE IS CREATING
          </h1>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            We are designing a high-performance, headless digital experience. Our new space is opening soon.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 py-8 border-t border-white/10 z-10 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
        <div>© 2026 YUBBY DUBBY. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">TikTok</a>
        </div>
      </footer>
    </main>
  );
}
