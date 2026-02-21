"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-brand-black">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-30 saturate-50"
            >
                <source src="/Video Project 4.mp4" type="video/mp4" />
            </video>

            <div className="relative z-10 text-center max-w-5xl px-4 sm:px-6 flex flex-col items-center mt-12 sm:mt-0">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-heading text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[0.9] mb-4 sm:mb-6"
                >
                    Elevating The <span className="text-brand-green italic drop-shadow-lg">Everyday</span>
                </motion.h1>

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
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 sm:px-0"
                >
                    <button className="w-full sm:w-auto bg-brand-green text-brand-black font-bold uppercase tracking-widest px-8 sm:px-10 py-3 sm:py-4 rounded-[var(--radius-btn)] hover:bg-white hover:shadow-[0_0_30px_rgba(177,243,16,0.5)] transition-all duration-300">
                        Shop Categories
                    </button>
                </motion.div>
            </div>

            {/* Decorative lines */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
            <div className="absolute left-0 sm:left-10 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent z-10 hidden sm:block" />
            <div className="absolute right-0 sm:right-10 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent z-10 hidden sm:block" />
        </section>
    );
}
