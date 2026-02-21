"use client";

import { motion } from "framer-motion";
import React from "react";

interface AuroraProps {
    colorStops?: string[];
    blend?: number;
    amplitude?: number;
    speed?: number;
}

export default function Aurora({
    colorStops = ["#7cff67", "#e9e7ee", "#29ff54"],
    blend = 0.5,
    amplitude = 1.0,
    speed = 1.5,
}: AuroraProps) {
    return (
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none z-0">
            <motion.div
                className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%]"
                animate={{
                    rotate: [0, 360],
                    scale: [1, 1 + amplitude * 0.1, 1],
                }}
                transition={{
                    rotate: { duration: 15 / speed, repeat: Infinity, ease: "linear" },
                    scale: { duration: 8 / speed, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{
                    background: `
                        radial-gradient(ellipse at 50% 50%, ${colorStops[0]} 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 20%, ${colorStops[1]} 0%, transparent 50%),
                        radial-gradient(ellipse at 20% 80%, ${colorStops[2]} 0%, transparent 50%)
                    `,
                    backgroundSize: "100% 100%",
                    backgroundBlendMode: "screen",
                    filter: `blur(${15 * blend}px)`,
                    opacity: 0.9,
                }}
            />
            {/* Base overlay for contrast */}
            <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[2px]" />
        </div>
    );
}
