"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
            className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-brand-black"
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
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-15 saturate-100"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
            </motion.div>

            {/* Text content with parallax */}
            <motion.div
                style={{ y: textY, opacity: textOpacity }}
                className="relative z-10 text-center max-w-5xl px-4 sm:px-6 flex flex-col items-center mt-12 sm:mt-0"
            >
                <div className="mb-4 sm:mb-6 flex flex-col items-center">
                    <TextReveal
                        text="Elevating The"
                        type="chars"
                        className="font-heading text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[0.9]"
                    />
                    <TextReveal
                        text="Everyday"
                        type="chars"
                        delay={0.4}
                        className="text-brand-green italic drop-shadow-lg font-heading text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[0.9]"
                    />
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-gray-200 text-sm sm:text-lg md:text-xl max-w-2xl mb-8 sm:mb-10 tracking-wide font-sans drop-shadow-md px-2 sm:px-0"
                >
                    From mens and womens fashion to kids, home living and accessories, redefine everyday style.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex justify-center sm:justify-start gap-4 w-full sm:w-auto px-6 sm:px-0 mt-2"
                >
                    <button className="bg-brand-green text-brand-black font-bold uppercase tracking-widest px-8 sm:px-10 py-3 sm:py-4 rounded-[var(--radius-btn)] hover:bg-white hover:shadow-[0_0_30px_rgba(177,243,16,0.5)] transition-all duration-300">
                        Shop Categories
                    </button>
                </motion.div>
            </motion.div>

            {/* Decorative lines */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
            <div className="absolute left-0 sm:left-10 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent z-10 hidden sm:block" />
            <div className="absolute right-0 sm:right-10 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent z-10 hidden sm:block" />
        </section>
    );
}
