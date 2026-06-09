import Image from "next/image";

export const metadata = {
  title: "YUBBY DUBBY | SECURE_STAGED",
  description: "Aesthetic structure under construction. Access denied. System rebooting.",
};

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans">
      {/* Cyberpunk Scanlines & Grid Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-grid" />
      <div className="absolute inset-0 z-0 pointer-events-none scanlines" />

      {/* Cyberpunk Glitch Style CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bg-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }

        .scanlines {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.25) 50%
          ), linear-gradient(
            90deg, 
            rgba(255, 0, 0, 0.06), 
            rgba(0, 255, 0, 0.02), 
            rgba(0, 0, 255, 0.06)
          );
          background-size: 100% 4px, 6px 100%;
        }

        @keyframes glitch-anim {
          0% {
            clip-path: inset(80% 0 1% 0);
          }
          10% {
            clip-path: inset(15% 0 64% 0);
            transform: skew(0.5deg);
          }
          20% {
            clip-path: inset(90% 0 5% 0);
          }
          30% {
            clip-path: inset(5% 0 85% 0);
            transform: skew(-0.5deg);
          }
          40% {
            clip-path: inset(40% 0 45% 0);
          }
          50% {
            clip-path: inset(70% 0 10% 0);
            transform: skew(1deg);
          }
          60% {
            clip-path: inset(12% 0 78% 0);
          }
          70% {
            clip-path: inset(55% 0 35% 0);
            transform: skew(-1deg);
          }
          80% {
            clip-path: inset(30% 0 60% 0);
          }
          90% {
            clip-path: inset(85% 0 2% 0);
          }
          100% {
            clip-path: inset(20% 0 70% 0);
          }
        }

        .cyber-glitch {
          position: relative;
          animation: glitch-skew 1s infinite linear alternate-reverse;
        }

        .cyber-glitch::before,
        .cyber-glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #030303;
        }

        .cyber-glitch::before {
          left: 3px;
          text-shadow: -2px 0 #ff00c1;
          clip-path: inset(0 0 0 0);
          animation: glitch-anim 2s infinite linear alternate-reverse;
        }

        .cyber-glitch::after {
          left: -3px;
          text-shadow: -2px 0 #00fff9, 0 2px #ff00c1;
          clip-path: inset(0 0 0 0);
          animation: glitch-anim 3s infinite linear alternate-reverse;
        }

        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          10% { transform: skew(-1deg); }
          20% { transform: skew(1deg); }
          30% { transform: skew(0deg); }
          40% { transform: skew(-0.5deg); }
          50% { transform: skew(0.5deg); }
          100% { transform: skew(0deg); }
        }

        /* HUD bracket borders */
        .hud-border {
          position: relative;
        }
        .hud-border::before,
        .hud-border::after,
        .hud-border-inner::before,
        .hud-border-inner::after {
          content: '';
          position: absolute;
          width: 15px;
          height: 15px;
          border-color: #B1F310;
          border-style: solid;
        }
        .hud-border::before {
          top: -2px;
          left: -2px;
          border-width: 2px 0 0 2px;
        }
        .hud-border::after {
          top: -2px;
          right: -2px;
          border-width: 2px 2px 0 0;
        }
        .hud-border-inner::before {
          bottom: -2px;
          left: -2px;
          border-width: 0 0 2px 2px;
        }
        .hud-border-inner::after {
          bottom: -2px;
          right: -2px;
          border-width: 0 2px 2px 0;
        }
      ` }} />

      {/* Background Glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-radial from-[#B1F310]/15 via-transparent to-transparent blur-3xl opacity-75" />
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl flex justify-between items-center py-4 z-10 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
        <div>SYS_STATUS: OFFLINE</div>
        <div>STAGED_REF: DEV_1.0.2</div>
      </header>

      {/* Content */}
      <div className="flex flex-col items-center justify-center max-w-xl text-center space-y-10 z-10 my-auto">
        
        {/* glitched logo */}
        <div className="relative w-80 h-24 flex items-center justify-center select-none">
          <div className="absolute inset-0 opacity-20 blur-sm scale-105 pointer-events-none">
            <Image
              src="/LOGOO.png"
              alt="Yubby Dubby logo glow"
              fill
              className="object-contain"
            />
          </div>
          <Image
            src="/LOGOO.png"
            alt="Yubby Dubby Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* HUD box container */}
        <div className="hud-border bg-black/85 border border-white/5 p-8 md:p-12 space-y-8 w-full max-w-md backdrop-blur-md">
          <div className="hud-border-inner" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#B1F310]/30 bg-[#B1F310]/10 text-[10px] text-[#B1F310] tracking-[0.25em] uppercase font-bold font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B1F310] animate-ping" />
            access_staged: denied
          </div>

          <div className="space-y-4">
            <h1 
              data-text="A NEW STRUCTURE IS CREATING" 
              className="cyber-glitch text-3xl md:text-4xl font-heading font-black uppercase tracking-tighter leading-none text-white select-none"
            >
              A NEW STRUCTURE IS CREATING
            </h1>

            <p className="text-gray-400 font-sans text-xs md:text-sm leading-relaxed uppercase tracking-wider">
              We are designing a high-performance, headless digital experience. Our new space is opening soon.
            </p>
          </div>

          {/* Cyberpunk HUD Stats Decoration */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 font-mono text-[9px] text-gray-500 uppercase text-left tracking-widest">
            <div>
              <span className="text-[#B1F310]">LOC:</span> CORE_SERVER
            </div>
            <div>
              <span className="text-[#B1F310]">DEV:</span> COMPLETED
            </div>
            <div>
              <span className="text-[#B1F310]">SYS:</span> HEADLESS_WC
            </div>
            <div>
              <span className="text-[#B1F310]">EST:</span> Q2_2026
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 py-8 border-t border-white/10 z-10 text-[9px] text-gray-500 uppercase tracking-widest font-bold font-mono">
        <div>© 2026 YUBBY DUBBY. SYSTEM LOCKDOWN ACTIVE.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#B1F310] transition-colors">Instagram</a>
          <a href="#" className="hover:text-[#B1F310] transition-colors">TikTok</a>
        </div>
      </footer>
    </main>
  );
}
