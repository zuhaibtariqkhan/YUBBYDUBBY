"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Don't render on touch devices
        if ("ontouchstart" in window) return;

        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            setIsVisible(true);

            // Dot follows instantly
            dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.style.cursor === "pointer" ||
                window.getComputedStyle(target).cursor === "pointer";

            setIsHovering(!!isClickable);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        // Smooth ring trailing animation
        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            if (ring) {
                const size = isHovering ? 50 : 32;
                ring.style.transform = `translate(${ringX - size / 2}px, ${ringY - size / 2}px)`;
            }

            requestAnimationFrame(animateRing);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseleave", handleMouseLeave);
        const animationId = requestAnimationFrame(animateRing);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationId);
        };
    }, [isHovering]);

    return (
        <>
            {/* Inner dot */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#B1F310",
                    opacity: isVisible ? 1 : 0,
                    transition: "opacity 0.3s ease",
                }}
            />
            {/* Outer ring */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
                style={{
                    width: isHovering ? 50 : 32,
                    height: isHovering ? 50 : 32,
                    borderRadius: "50%",
                    border: `2px solid ${isHovering ? "#B1F310" : "rgba(255,255,255,0.6)"}`,
                    backgroundColor: isHovering ? "rgba(177,243,16,0.1)" : "transparent",
                    opacity: isVisible ? 1 : 0,
                    transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, opacity 0.3s ease",
                    boxShadow: isHovering ? "0 0 20px rgba(177,243,16,0.3)" : "none",
                }}
            />
        </>
    );
}
