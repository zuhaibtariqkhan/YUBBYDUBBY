"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, ShoppingBag, Mail, Check, Clock } from "lucide-react";

// Countdown Target Date: Exactly 7 days from June 9, 2026 20:52:00
const TARGET_DATE = new Date("2026-06-16T15:22:00Z").getTime();

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ComingSoonClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 1. Interactive Canvas Particles Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000, radius: 150 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update(w: number, h: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce borders
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        // Mouse interaction (repelling effect)
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(177, 243, 16, ${this.alpha})`; // Accent Green glow
        context.shadowBlur = 8;
        context.shadowColor = "#B1F310";
        context.fill();
        context.restore();
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = (100 - dist) / 100 * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(177, 243, 16, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid overlay details
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Update and draw particles
      particles.forEach((p) => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });

      drawConnections();

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // 2. Real-Time Countdown Timer Logic
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Email Submission Validation & Handler
  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage("");
    setIsSubmitted(true);
    // Simulate database storage local key log
    console.log(`Saved email submission: ${email}`);
  };

  const featureCards = [
    {
      title: "Massive Product Collection",
      desc: "Thousands of products across multiple streetwear & lifestyle categories.",
      icon: <Sparkles className="w-6 h-6 text-brand-green" />,
    },
    {
      title: "Premium Quality Only",
      desc: "Carefully selected raw structures from certified, trusted global suppliers.",
      icon: <ShieldCheck className="w-6 h-6 text-brand-green" />,
    },
    {
      title: "Lightning Fast Experience",
      desc: "Edge-cached headless architecture optimized for absolute instant speeds.",
      icon: <Zap className="w-6 h-6 text-brand-green" />,
    },
    {
      title: "Next Generation Shopping",
      desc: "Smooth animations, secure multi-currency checkouts, and clean UI mechanics.",
      icon: <ShoppingBag className="w-6 h-6 text-brand-green" />,
    },
  ];

  // Helper to format numbers with leading zero
  const padZero = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-white flex flex-col justify-between overflow-x-hidden font-sans z-10 select-none">
      
      {/* Interactive Particles Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full" />

      {/* Grid Scanline Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]" />

      {/* Ambient background glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-radial from-[#B1F310]/8 via-transparent to-transparent blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-radial from-[#B1F310]/4 via-transparent to-transparent blur-[100px] pointer-events-none z-0" />

      {/* 1. Header (Navbar mockup) */}
      <header className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 flex justify-between items-center z-20 relative">
        <div className="relative w-44 h-12 flex items-center justify-start">
          <Image
            src="/LOGOO.png"
            alt="Yubby Dubby Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[10px] uppercase font-mono tracking-widest text-gray-400">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
          Status: DEV_STAGED_ACTIVE
        </div>
      </header>

      {/* 2. Main Content Wrapper */}
      <main className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col items-center gap-20 z-20 relative">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-8 max-w-3xl mt-6">
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes gradient-shift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .highlight-text {
              background: linear-gradient(90deg, #FFFFFF, #B1F310, #FFFFFF, #B1F310);
              background-size: 300% 300%;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: gradient-shift 6s ease-in-out infinite;
              filter: drop-shadow(0 0 15px rgba(177, 243, 16, 0.25));
            }
          ` }} />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-green/20 bg-brand-green/5 text-xs text-brand-green uppercase tracking-[0.2em] font-bold font-mono"
          >
            System Upgrade In Progress
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-black uppercase tracking-tighter leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
          >
            The Future of <br className="hidden md:inline" />
            <span className="highlight-text">
              Online Shopping
            </span> <br className="hidden md:inline" />
            Is Loading
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-gray-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed font-sans text-left bg-white/[0.01] border border-white/5 p-6 md:p-8 rounded-[var(--radius-card)] backdrop-blur-md space-y-4"
          >
            <p className="text-white font-bold text-sm md:text-base text-center">
              Yubby Dubby is entering its next evolution.
            </p>
            <p>
              We are building a faster, smarter, and more immersive shopping experience designed for the future. Behind the scenes, our team is crafting a premium digital marketplace where innovation, design, and convenience come together seamlessly.
            </p>
            <p>
              From fashion and lifestyle products to home décor, accessories, tech essentials, and exclusive collections, Yubby Dubby is being reimagined to deliver a world-class online shopping experience unlike anything before.
            </p>
            <p>
              Every detail is being refined. Every feature is being enhanced. Every interaction is being designed with precision.
            </p>
            <p className="text-brand-green font-bold tracking-widest uppercase text-center py-2 border-y border-white/5">
              The future of shopping is loading.
            </p>
            <p className="text-center text-xs text-gray-500">
              Stay connected and be among the first to experience the next generation of Yubby Dubby when we officially launch.
            </p>
            <p className="text-brand-green font-heading font-black text-center text-lg md:text-xl uppercase tracking-widest pt-2">
              Something extraordinary is coming.
            </p>
          </motion.div>
        </section>

        {/* COUNTDOWN TIMER */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-[24px] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.8),_0_0_50px_rgba(177,243,16,0.02)] relative overflow-hidden"
        >
          {/* Inner HUD lines decoration */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-green/30 rounded-tl-[24px]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-green/30 rounded-tr-[24px]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-green/30 rounded-bl-[24px]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-green/30 rounded-br-[24px]" />

          <div className="grid grid-cols-4 gap-4 md:gap-8 text-center relative z-10">
            {/* Days */}
            <div className="space-y-2">
              <div className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-widest text-brand-green drop-shadow-[0_0_20px_rgba(177,243,16,0.3)]">
                {padZero(timeRemaining.days)}
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold font-mono">Days</div>
            </div>
            {/* Hours */}
            <div className="space-y-2 border-l border-white/5">
              <div className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-widest text-white">
                {padZero(timeRemaining.hours)}
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold font-mono">Hours</div>
            </div>
            {/* Minutes */}
            <div className="space-y-2 border-l border-white/5">
              <div className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-widest text-white">
                {padZero(timeRemaining.minutes)}
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold font-mono">Minutes</div>
            </div>
            {/* Seconds */}
            <div className="space-y-2 border-l border-white/5">
              <div className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-widest text-brand-green drop-shadow-[0_0_20px_rgba(177,243,16,0.3)]">
                {padZero(timeRemaining.seconds)}
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold font-mono">Seconds</div>
            </div>
          </div>
        </motion.section>

        {/* EMAIL NOTIFICATION SYSTEM */}
        <section className="w-full max-w-lg text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-bold uppercase tracking-wide text-white">
              Be The First To Know
            </h2>
            <p className="text-gray-400 text-xs md:text-sm font-sans">
              Enter your email to receive early access codes and system launch coordinates.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleNotifySubmit}
                className="flex flex-col sm:flex-row gap-3 w-full"
              >
                <div className="relative flex-grow">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL ADDRESS"
                    className="w-full h-14 pl-12 pr-4 bg-white/[0.02] border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider placeholder-gray-600 focus:outline-none focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/35 transition-all text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="h-14 px-8 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-[var(--radius-btn)] hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.4)] transition-all shrink-0 cursor-pointer"
                >
                  Notify Me
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center p-6 bg-brand-green/10 border border-brand-green/20 rounded-[var(--radius-card)] space-y-2 text-brand-green"
              >
                <div className="w-10 h-10 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center">
                  <Check className="w-5 h-5 text-brand-green" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider">Access Granted</h3>
                <p className="text-gray-400 text-xs">Your coordinates are logged. Launch notifications will follow.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {errorMessage && (
            <p className="text-red-500 text-xs font-mono uppercase tracking-wider">{errorMessage}</p>
          )}
        </section>

        {/* FEATURES GRID SECTION */}
        <section className="w-full space-y-10 pt-10 border-t border-white/5">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-heading font-black uppercase tracking-tighter">
              Aesthetic Features Grid
            </h2>
            <p className="text-gray-400 text-xs font-sans max-w-sm mx-auto">
              Technological specifications for our upcoming headless storefront infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card, idx) => (
              <div
                key={idx}
                className="group relative bg-white/[0.01] border border-white/5 p-6 rounded-[var(--radius-card)] backdrop-blur-md transition-all duration-300 hover:bg-white/[0.03] hover:border-brand-green/20 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(177,243,16,0.05)]"
              >
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/10 group-hover:border-brand-green/45 rounded-tl-[var(--radius-card)] transition-colors" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/10 group-hover:border-brand-green/45 rounded-br-[var(--radius-card)] transition-colors" />
                
                <div className="w-12 h-12 rounded-[var(--radius-dropdown)] bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-brand-green/10 group-hover:border-brand-green/30 transition-all">
                  {card.icon}
                </div>
                <h3 className="font-heading font-black text-lg uppercase tracking-tight text-white mb-2 group-hover:text-brand-green transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed font-sans">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 3. Footer */}
      <footer className="w-full border-t border-white/5 py-10 z-20 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-6 text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-bold font-mono text-center sm:text-left">
          <div className="space-y-1">
            <div>© 2026 YUBBY DUBBY. ALL RIGHTS RESERVED.</div>
            <div className="text-gray-600 font-sans">Crafting the Future of Online Shopping</div>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-green transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-green transition-colors">TikTok</a>
            <a href="#" className="hover:text-brand-green transition-colors">Twitter</a>
          </div>
          <div className="text-gray-600">
            Designed & Developed with Precision by ZTK
          </div>
        </div>
      </footer>
    </div>
  );
}
