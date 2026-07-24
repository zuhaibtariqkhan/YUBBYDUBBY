"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import TextReveal from "../ui/TextReveal";

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    // Parallax: video moves slower, text moves faster
    const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[88dvh] md:min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-brand-black py-16 md:py-0"
        >
            {/* Background Video with parallax */}
            <motion.div
                style={{ y: videoY, scale: videoScale }}
                className="absolute inset-0 z-0 will-change-transform"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-20 saturate-100"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
            </motion.div>
 
            {/* Text content with parallax */}
            <motion.div
                style={{ y: textY, opacity: textOpacity }}
                className="relative z-10 text-center max-w-5xl px-5 sm:px-6 flex flex-col items-center justify-center my-auto pt-6 md:pt-0"
            >
                <div className="mb-4 sm:mb-6 flex flex-col items-center">
                    <TextReveal
                        text="Elevating The"
                        type="chars"
                        className="font-heading text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.95]"
                    />
                    <TextReveal
                        text="Everyday"
                        type="chars"
                        delay={0.4}
                        className="text-brand-green italic drop-shadow-lg font-heading text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.95]"
                    />
                </div>
 
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-gray-300 text-xs sm:text-base md:text-lg max-w-xl mb-6 sm:mb-8 tracking-wide font-sans drop-shadow-md px-2 sm:px-0 leading-relaxed"
                >
                    From mens and womens fashion to kids, home living and accessories, redefine everyday style.
                </motion.p>
 
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex justify-center gap-4 w-full sm:w-auto px-4 sm:px-0"
                >
                    <Link href="/shop" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto min-h-[44px] bg-brand-green text-brand-black font-bold uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-4 text-xs sm:text-sm rounded-[var(--radius-btn)] hover:bg-white hover:shadow-[0_0_30px_rgba(177,243,16,0.5)] active:scale-98 transition-all duration-300 cursor-pointer flex items-center justify-center">
                            Shop Categories
                        </button>
                    </Link>
                </motion.div>
            </motion.div>
 
            {/* Decorative lines */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
            <div className="absolute left-0 sm:left-10 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent z-10 hidden sm:block" />
            <div className="absolute right-0 sm:right-10 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent z-10 hidden sm:block" />
        </section>
    );
}
