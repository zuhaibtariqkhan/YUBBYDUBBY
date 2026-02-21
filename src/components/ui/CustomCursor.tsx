"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
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
        let isHovering = false;
        let targetRect: DOMRect | null = null;
        let targetRadius = "50%";

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            setIsVisible(true);

            // Dot follows instantly
            dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const clickable = target.closest("a") || target.closest("button") || (window.getComputedStyle(target).cursor === "pointer" ? target : null);

            if (clickable) {
                isHovering = true;
                const rect = clickable.getBoundingClientRect();

                // Only apply magnetic snap for reasonably sized elements (e.g. not huge image links)
                if (rect.width < 300 && rect.height < 100) {
                    targetRect = rect;
                    targetRadius = window.getComputedStyle(clickable).borderRadius || "8px";
                    // If no border radius found, default to slight rounding
                    if (targetRadius === "0px") targetRadius = "8px";
                } else {
                    targetRect = null;
                }
            } else {
                isHovering = false;
                targetRect = null;
                targetRadius = "50%";
            }
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
            isHovering = false;
            targetRect = null;
        };

        let animationId: number;

        // Smooth ring trailing animation with magnetic morphing
        const animateRing = () => {
            if (targetRect && isHovering) {
                // Snap to target center
                const targetX = targetRect.left + targetRect.width / 2;
                const targetY = targetRect.top + targetRect.height / 2;

                // Faster interpolation for the magnetic snap
                ringX += (targetX - ringX) * 0.25;
                ringY += (targetY - ringY) * 0.25;

                if (ring) {
                    const padding = 12; // Extra padding around the button
                    const w = targetRect.width + padding;
                    const h = targetRect.height + padding;

                    ring.style.width = `${w}px`;
                    ring.style.height = `${h}px`;
                    ring.style.transform = `translate(${ringX - w / 2}px, ${ringY - h / 2}px)`;
                    ring.style.borderRadius = targetRadius;
                    ring.style.backgroundColor = "rgba(177, 243, 16, 0.08)"; // subtle brand green filling
                    ring.style.borderColor = "rgba(177, 243, 16, 0.4)";
                    ring.style.mixBlendMode = "normal";
                }
            } else {
                // Normal trailing behavior
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;

                if (ring) {
                    const size = isHovering ? 50 : 32;
                    ring.style.width = `${size}px`;
                    ring.style.height = `${size}px`;
                    ring.style.transform = `translate(${ringX - size / 2}px, ${ringY - size / 2}px)`;
                    ring.style.borderRadius = "50%";
                    ring.style.backgroundColor = isHovering ? "rgba(177, 243, 16, 0.1)" : "transparent";
                    ring.style.borderColor = isHovering ? "#B1F310" : "rgba(255, 255, 255, 0.6)";
                    ring.style.mixBlendMode = "difference";
                }
            }

            animationId = requestAnimationFrame(animateRing);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseleave", handleMouseLeave);
        animationId = requestAnimationFrame(animateRing);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <>
            {/* Inner dot */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden sm:block"
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
                className="fixed top-0 left-0 z-[9998] pointer-events-none hidden sm:block"
                style={{
                    opacity: isVisible ? 1 : 0,
                    transition: "width 0.25s ease-out, height 0.25s ease-out, border-radius 0.25s ease-out, border-color 0.3s ease, background-color 0.3s ease, opacity 0.3s ease",
                    border: "2px solid rgba(255,255,255,0.6)",
                }}
            />
        </>
    );
}
