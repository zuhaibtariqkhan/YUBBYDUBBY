"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
    text: string;
    className?: string;
    type?: "chars" | "words";
    delay?: number;
}

export default function TextReveal({ text, className = "", type = "words", delay = 0 }: TextRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const items = type === "chars" ? text.split("") : text.split(" ");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: type === "chars" ? 0.03 : 0.08,
                delayChildren: delay,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, rotateX: -45 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring" as const,
                damping: 20,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.span
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className={`inline-flex flex-wrap ${className}`}
            style={{ perspective: "1000px" }}
        >
            {items.map((item, index) => (
                <span key={index} className="inline-flex overflow-visible pb-2 -mb-2 pr-1 -mr-1">
                    <motion.span
                        variants={itemVariants}
                        className="inline-block"
                        style={{ transformOrigin: "0% 50%" }}
                    >
                        {item === " " ? "\u00A0" : item}
                        {type === "words" && index !== items.length - 1 ? "\u00A0" : ""}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
}
