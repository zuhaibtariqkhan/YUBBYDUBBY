"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

// 
const reviews = [
    {
        id: 1,
        name: "Arjun Mehta",
        location: "Mumbai, India",
        rating: 5,
        text: "Fabric quality is seriously impressive. The fit is clean and premium, not flimsy like regular oversized tees. Been wearing it almost every weekend.",
        product: "Midnight Core Oversized Tee",
    },
    {
        id: 2,
        name: "Riya Sharma",
        location: "Delhi, India",
        rating: 5,
        text: "The stitching and finish feel high-end. I loved how the print came out exactly like my uploaded design. Worth the price.",
        product: "Urban Edge Relaxed Hoodie",
    },
    {
        id: 3,
        name: "Aisha Khan",
        location: "Srinagar, India",
        rating: 5,
        text: "Super soft material and comfortable for my son. Quality is much better than typical online brands. Will definitely order again.",
        product: "Everyday Minimal Kids Set",
    },
    {
        id: 4,
        name: "Aatif Wani",
        location: "Pulwama, India",
        rating: 5,
        text: "Solid build and great attention to detail. The embroidery is sharp and the fit is perfect. Shipping was smooth and well handled.",
        product: "Signature Street Cap",
    },
    {
        id: 5,
        name: "Daniel Thompson",
        location: "Manchester, United Kingdom",
        rating: 5,
        text: "he texture and print quality exceeded expectations. Looks very classy in my living room. Packaging was neat and premium too..",
        product: "Elevate Living Cushion Cover",
    },
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 200 : -200,
        opacity: 0,
        scale: 0.95,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -200 : 200,
        opacity: 0,
        scale: 0.95,
    }),
};

export default function ReviewsCarousel() {
    const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
    const [isPaused, setIsPaused] = useState(false);

    const paginate = useCallback(
        (newDirection: number) => {
            setActiveIndex(([prev]) => {
                const next = (prev + newDirection + reviews.length) % reviews.length;
                return [next, newDirection];
            });
        },
        []
    );

    // Auto-play
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => paginate(1), 5000);
        return () => clearInterval(interval);
    }, [isPaused, paginate]);

    const review = reviews[activeIndex];

    return (
        <section className="bg-brand-black text-brand-white py-12 sm:py-16 md:py-28 px-4 sm:px-6 border-t border-white/10 overflow-hidden">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 md:mb-16"
                >
                    <span className="text-brand-green font-bold tracking-widest uppercase text-xs md:text-sm mb-2 md:mb-3 block">
                        Testimonials
                    </span>
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter">
                        What People Say
                    </h2>
                </motion.div>

                {/* Carousel */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Navigation arrows (hidden on mobile to reduce clutter) */}
                    <button
                        onClick={() => paginate(-1)}
                        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 md:-translate-x-12 rounded-full border border-white/15 items-center justify-center hover:border-brand-green transition-colors text-white/50 hover:text-brand-green"
                        aria-label="Previous review"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => paginate(1)}
                        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 md:translate-x-12 rounded-full border border-white/15 items-center justify-center hover:border-brand-green transition-colors text-white/50 hover:text-brand-green"
                        aria-label="Next review"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Review card */}
                    <div className="relative min-h-[220px] md:min-h-[240px] flex items-center justify-center px-4 sm:px-16 md:px-20">
                        <AnimatePresence custom={direction} mode="wait">
                            <motion.div
                                key={review.id}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: 0.4,
                                    ease: "easeInOut",
                                }}
                                className="w-full text-center"
                            >
                                {/* Quote icon */}
                                <Quote
                                    className="text-brand-green/30 mx-auto mb-4 md:mb-6 w-6 h-6 md:w-10 md:h-10"
                                    fill="rgba(177,243,16,0.1)"
                                />

                                {/* Stars */}
                                <div className="flex items-center justify-center gap-1 mb-4 md:mb-5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 md:w-[18px] md:h-[18px] ${i < review.rating
                                                    ? "fill-brand-green text-brand-green"
                                                    : "text-white/20"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Review text */}
                                <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto font-sans mb-6 md:mb-8 italic px-2 sm:px-0">
                                    &ldquo;{review.text}&rdquo;
                                </p>

                                {/* Customer info */}
                                <div>
                                    <p className="font-bold uppercase tracking-widest text-xs md:text-sm text-white">
                                        {review.name}
                                    </p>
                                    <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest mt-1">
                                        {review.location}
                                        {review.product && (
                                            <>
                                                <span className="mx-1.5 opacity-50">|</span>
                                                <span className="text-brand-green/70">
                                                    {review.product}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dots */}
                    <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
                        {reviews.map((_, i) => (
                            <button
                                key={i}
                                onClick={() =>
                                    setActiveIndex([i, i > activeIndex ? 1 : -1])
                                }
                                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${i === activeIndex
                                        ? "w-6 md:w-8 bg-brand-green"
                                        : "w-1.5 md:w-2 bg-white/20 hover:bg-white/40"
                                    }`}
                                aria-label={`Go to review ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
