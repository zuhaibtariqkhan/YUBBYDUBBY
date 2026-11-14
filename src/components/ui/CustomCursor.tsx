"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Don't render on touch devices
        if (typeof window === "undefined" || "ontouchstart" in window || window.matchMedia("(pointer: coarse)").matches) {
            return;
        }

        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        let isHovering = false;
        let isIdle = false;
        let idleTimer: ReturnType<typeof setTimeout> | null = null;
        let animationId: number;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Set opacity directly via DOM
            dot.style.opacity = "1";
            ring.style.opacity = "1";

            // Dot follows instantly using hardware-accelerated translate3d
            dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;

            // Restart animation loop if idle
            if (isIdle) {
                isIdle = false;
                animationId = requestAnimationFrame(animateRing);
            }
            if (idleTimer) clearTimeout(idleTimer);
            idleTimer = setTimeout(() => { isIdle = true; }, 150);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            // Use native selector matching without calling getComputedStyle (prevents layout thrashing)
            const clickable = target.closest("a, button, [role='button'], input, select, textarea, .cursor-pointer");
            isHovering = !!clickable;
        };

        const handleMouseLeave = () => {
            dot.style.opacity = "0";
            ring.style.opacity = "0";
            isHovering = false;
        };

        // Smooth ring trailing animation with GPU-accelerated transforms
        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;

            const scale = isHovering ? 1.6 : 1.0;
            ring.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0) scale(${scale})`;
            ring.style.borderColor = isHovering ? "#B1F310" : "rgba(255, 255, 255, 0.55)";
            ring.style.backgroundColor = isHovering ? "rgba(177, 243, 16, 0.12)" : "transparent";

            if (!isIdle) {
                animationId = requestAnimationFrame(animateRing);
            }
        };

        document.addEventListener("mousemove", handleMouseMove, { passive: true });
        document.addEventListener("mouseover", handleMouseOver, { passive: true });
        document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
        animationId = requestAnimationFrame(animateRing);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            if (idleTimer) clearTimeout(idleTimer);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <>
            {/* Inner dot */}
            <div
                ref={dotRef}
                className="custom-cursor-dot fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference will-change-transform"
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#B1F310",
                    opacity: 0,
                    transition: "opacity 0.25s ease",
                    pointerEvents: "none",
                }}
            />
            {/* Outer ring */}
            <div
                ref={ringRef}
                className="custom-cursor-ring fixed top-0 left-0 z-[9998] pointer-events-none will-change-transform mix-blend-difference"
                style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.6)",
                    opacity: 0,
                    transition: "opacity 0.25s ease, border-color 0.2s ease, background-color 0.2s ease",
                    pointerEvents: "none",
                }}
            />
        </>
    );
}
