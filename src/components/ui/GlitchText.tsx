"use client";

import React, { HTMLAttributes } from "react";

interface GlitchTextProps extends HTMLAttributes<HTMLSpanElement> {
    text: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";
}

export default function GlitchText({ text, className = "", as: Component = "span", ...props }: GlitchTextProps) {
    return (
        <Component
            className={`relative inline-block group cursor-pointer ${className}`}
            {...props}
        >
            <span className="relative z-10 inline-block">{text}</span>
            <span
                className="absolute top-0 left-0 z-0 w-full h-full opacity-0 group-hover:opacity-100 text-[#0ff] mix-blend-screen glitch-layer-1"
                aria-hidden="true"
            >
                {text}
            </span>
            <span
                className="absolute top-0 left-0 z-0 w-full h-full opacity-0 group-hover:opacity-100 text-[#f0f] mix-blend-screen glitch-layer-2"
                aria-hidden="true"
            >
                {text}
            </span>
        </Component>
    );
}
