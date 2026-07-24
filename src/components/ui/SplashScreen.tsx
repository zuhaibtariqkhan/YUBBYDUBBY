"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function SplashScreen() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [phase, setPhase] = useState<"playing" | "exit">("playing");
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setMounted(true);
        // Show splash entrance loading screen on homepage entrance
        if (pathname === "/") {
            setIsVisible(true);
            setPhase("playing");
        }
    }, [pathname]);

    useEffect(() => {
        if (isVisible && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch((err) => {
                console.log("Splash video play handled:", err);
            });
        }
    }, [isVisible]);

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isVisible]);

    const handleVideoEnd = () => {
        setPhase("exit");
        setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = "";
        }, 500);
    };

    // Auto-dismiss safety timer
    useEffect(() => {
        if (!isVisible) return;
        const fallback = setTimeout(() => {
            if (phase === "playing") {
                handleVideoEnd();
            }
        }, 3000);
        return () => clearTimeout(fallback);
    }, [phase, isVisible]);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="splash"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center bg-black cursor-pointer"
                    style={{ pointerEvents: phase === "exit" ? "none" : "auto" }}
                    onClick={handleVideoEnd}
                >
                    {/* Scan line sweep */}
                    <motion.div
                        initial={{ y: "-10vh" }}
                        animate={{ y: "110vh" }}
                        transition={{
                            duration: 2.2,
                            delay: 0.1,
                            ease: "easeInOut",
                        }}
                        className="absolute top-0 left-0 w-full h-[2px] z-20 will-change-transform"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent, #B1F310, rgba(177,243,16,0.4), transparent)",
                            boxShadow: "0 0 15px rgba(177,243,16,0.5)",
                        }}
                    />

                    {/* Corner accents */}
                    <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-brand-green/50 z-20" />
                    <div className="absolute top-6 right-6 sm:top-10 sm:right-10 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-brand-green/50 z-20" />
                    <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-brand-green/50 z-20" />
                    <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-brand-green/50 z-20" />

                    {/* Logo video */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={
                            phase === "exit"
                                ? { opacity: 0, scale: 1.1 }
                                : { opacity: 1, scale: 1 }
                        }
                        transition={{
                            duration: phase === "exit" ? 0.5 : 0.6,
                            ease: "easeOut",
                        }}
                        className="relative z-10 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] flex items-center justify-center will-change-transform"
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            preload="auto"
                            onEnded={handleVideoEnd}
                            className="w-full h-full object-contain"
                        >
                            <source src="/LOAD%20SCREEN.mp4" type="video/mp4" />
                        </video>
                    </motion.div>

                    {/* Decorative horizontal line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.0, delay: 0.1, ease: "easeInOut" }}
                        className="absolute top-1/2 left-0 w-full h-[1px] z-0 origin-center"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent 20%, rgba(177,243,16,0.2) 50%, transparent 80%)",
                        }}
                    />

                    {/* Welcome text */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={
                            phase === "exit"
                                ? { opacity: 0, y: -10 }
                                : { opacity: 1, y: 0 }
                        }
                        transition={{ duration: 0.5, delay: phase === "playing" ? 0.4 : 0 }}
                        className="absolute bottom-10 sm:bottom-14 text-[10px] sm:text-xs uppercase tracking-[0.4em] text-brand-green/80 font-sans z-20 font-bold"
                    >
                        Welcome
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
