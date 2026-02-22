"use client";

import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import TextReveal from "@/components/ui/TextReveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Fade in component for text blocks
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default function AboutPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <main className="min-h-screen bg-brand-black text-white relative selection:bg-brand-white selection:text-brand-black" ref={containerRef}>
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-black/80 to-brand-black z-10" />
                    <motion.div style={{ y }} className="w-full h-full opacity-30">
                        {/* Optional placeholder pattern or image, currently a dark subtle gradient */}
                        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-brand-black to-brand-black"></div>
                    </motion.div>
                </div>

                <div className="container mx-auto px-4 z-10 text-center">
                    <h1 className="font-oswald text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 leading-tight">
                        <TextReveal text="ABOUT" delay={0.2} />
                        <br />
                        <span className="text-[#00FF00]">
                            <TextReveal text="YUBBY DUBBY" delay={0.6} />
                        </span>
                    </h1>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-24 relative z-10 bg-brand-black">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <FadeIn className="mb-16">
                        <p className="font-montserrat text-xl md:text-3xl leading-relaxed font-light text-neutral-300">
                            Yubby Dubby is a contemporary e-commerce brand built on a powerful belief <span className="text-white font-medium">premium quality should be accessible, not exclusive.</span>
                        </p>
                    </FadeIn>

                    <div className="space-y-12 font-montserrat text-lg text-neutral-400 font-light leading-relaxed">
                        <FadeIn delay={0.2}>
                            <p>
                                We are a curated lifestyle destination offering an expansive range of products across men’s fashion, women’s fashion, kids’ wear, home & living, and versatile accessories. From statement tees and elegant skirts to refined footwear, stationery, towels, toys & games, tech accessories, sports essentials, headwear, wall art, and countless everyday essentials we bring together style and substance under one elevated platform.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <p>
                                At the heart of Yubby Dubby lies an uncompromising commitment to fabric integrity and craftsmanship. We meticulously focus on breathable, skin-friendly textiles, structured silhouettes, durable stitching, rich color retention, and premium finishing. Every product undergoes thoughtful consideration not only in design but in how it feels, performs, and lasts. Because true luxury is not defined by price tags, but by experience.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.4}>
                            <p>
                                Our collections are crafted to embody modern sophistication while remaining practical for daily living. We merge aesthetic minimalism with contemporary trends, ensuring each piece resonates with confidence, versatility, and timeless appeal. Whether it’s fashion that empowers personal expression or home accents that elevate spaces, our goal is to enhance lifestyles without inflating costs.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.5}>
                            <p>
                                Affordability, for us, is not a compromise it is a principle. We optimize sourcing, production, and logistics to ensure that high-end quality remains within reach. By balancing refined design with intelligent pricing, we make premium living attainable for everyone.
                            </p>
                        </FadeIn>
                    </div>

                    {/* Statement Block */}
                    <FadeIn delay={0.6} className="mt-24 py-12 border-y border-neutral-800 text-center">
                        <p className="font-oswald text-2xl md:text-4xl uppercase tracking-wider mb-8 text-white">
                            Yubby Dubby is more than a store it is a statement of intent.
                        </p>
                        <div className="flex flex-col gap-4 font-montserrat text-xl text-neutral-400 uppercase tracking-widest">
                            <span className="delay-100 transition-colors hover:text-white">A commitment to excellence.</span>
                            <span className="delay-200 transition-colors hover:text-white">A dedication to quality.</span>
                            <span className="delay-300 transition-colors hover:text-white">A promise of value.</span>
                        </div>
                        <p className="mt-12 font-montserrat text-lg text-neutral-300 max-w-2xl mx-auto">
                            We are here to redefine what affordable luxury truly means and to deliver it with consistency, integrity, and vision.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-32 relative z-10 bg-brand-white text-brand-black">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-24">
                        <h2 className="font-oswald text-5xl md:text-7xl font-black uppercase tracking-tighter text-brand-black">
                            OUR STORY
                        </h2>
                    </div>

                    <div className="relative w-full overflow-hidden sm:overflow-visible px-4">
                        {/* Vertical line for timeline effect */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-300 transform -translate-x-1/2"></div>

                        <div className="space-y-48 sm:space-y-32 font-montserrat text-[15px] sm:text-lg leading-relaxed">

                            <FadeIn className="relative w-1/2 pr-6 sm:pr-16 md:pr-16 ml-0 text-right">
                                <span className="absolute right-[-0.35rem] sm:right-[-0.5rem] top-2 w-3 h-3 rounded-full bg-brand-black"></span>
                                <p className="font-medium text-xl sm:text-2xl mb-4 text-brand-black">
                                    In 2022, in the quiet hall of a home a closed terrace transformed into a humble workspace Yubby Dubby was born.
                                </p>
                                <p className="text-neutral-600">
                                    There were no grand offices.<br />
                                    No large teams.<br />
                                    No warehouses filled with inventory.
                                </p>
                            </FadeIn>

                            <FadeIn className="relative w-1/2 pl-6 sm:pl-16 md:pl-16 ml-auto text-neutral-600 text-left">
                                <span className="absolute left-[-0.35rem] sm:left-[-0.5rem] top-2 w-3 h-3 rounded-full bg-neutral-400"></span>
                                <p className="font-medium text-lg sm:text-xl text-brand-black mb-4">
                                    Only four products.<br />
                                    One vision.
                                </p>
                                <p>
                                    And a single individual managing everything from conceptualizing designs and sourcing fabrics to packaging orders and delivering them personally.
                                </p>
                            </FadeIn>

                            <FadeIn className="relative w-1/2 pr-6 sm:pr-16 md:pr-16 ml-0 text-neutral-600 text-right">
                                <span className="absolute right-[-0.35rem] sm:right-[-0.5rem] top-2 w-3 h-3 rounded-full bg-neutral-400"></span>
                                <p className="italic text-lg sm:text-xl mb-6">
                                    &quot;Every late night carried uncertainty.<br />
                                    Every early morning carried belief.&quot;
                                </p>
                                <p>
                                    The journey began with passion, persistence, and an unwavering commitment to quality. Each order packed by hand was more than a delivery it was a promise. A promise that even a small beginning could hold premium ambition.
                                </p>
                            </FadeIn>

                            <FadeIn className="relative w-1/2 pl-6 sm:pl-16 md:pl-16 ml-auto text-neutral-600 text-left">
                                <span className="absolute left-[-0.35rem] sm:left-[-0.5rem] top-2 w-3 h-3 rounded-full bg-neutral-400"></span>
                                <p className="font-oswald text-xl sm:text-2xl uppercase tracking-widest text-brand-black mb-6">
                                    Mistakes became lessons.<br />
                                    Challenges became fuel.<br />
                                    Limitations became strength.
                                </p>
                                <p>
                                    What started with just four products gradually evolved into a growing catalogue spanning fashion, lifestyle, accessories, and home essentials expanding not just in numbers, but in refinement, structure, and vision.
                                </p>
                            </FadeIn>

                            <FadeIn className="relative w-1/2 pr-6 sm:pr-16 md:pr-16 ml-0 text-neutral-600 text-right">
                                <span className="absolute right-[-0.35rem] sm:right-[-0.5rem] top-2 w-3 h-3 rounded-full bg-neutral-400"></span>
                                <p className="mb-4">
                                    Today, Yubby Dubby stands with confidence not because of scale alone, but because of resilience. From a terrace workspace to a structured brand identity, from single-handed operations to an expanding ecosystem, the evolution has been intentional and relentless.
                                </p>
                                <p className="font-medium text-brand-black text-xl">
                                    Yet, our foundation remains unchanged.
                                </p>
                            </FadeIn>

                            <FadeIn className="relative w-1/2 pl-6 sm:pl-16 md:pl-16 ml-auto text-neutral-600 text-left">
                                <span className="absolute left-[-0.35rem] sm:left-[-0.5rem] top-2 w-3 h-3 rounded-full bg-brand-black"></span>
                                <ul className="space-y-4 mb-8 font-medium text-[14px] sm:text-base text-brand-black inline-block text-left">
                                    <li>✓ We still obsess over fabric quality.</li>
                                    <li>✓ We still prioritize durability.</li>
                                    <li>✓ We still design with intention.</li>
                                    <li>✓ We still believe affordability should never compromise excellence.</li>
                                </ul>
                                <p>
                                    Yubby Dubby is built on courage the courage to start small, think big, and execute relentlessly.
                                </p>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision / Finale */}
            <section className="py-32 relative bg-brand-black text-white text-center">
                <div className="container mx-auto px-4 max-w-4xl">
                    <FadeIn>
                        <h3 className="font-oswald text-sm md:text-base uppercase tracking-[0.3em] text-neutral-500 mb-8">
                            Our Vision
                        </h3>
                        <p className="font-montserrat text-2xl md:text-4xl md:leading-tight font-light mb-16 text-neutral-200">
                            To become a globally recognized lifestyle brand that represents premium aesthetics, uncompromising quality, and accessible pricing empowering individuals to express themselves through fashion and curated living.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <div className="py-16 border-t border-neutral-800 mt-16"></div>
                        <p className="font-montserrat text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
                            From four products in a closed terrace to a diversified e-commerce destination this is not just growth.
                        </p>
                        <h2 className="font-oswald text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">
                            This is purpose in motion.
                        </h2>
                        <p className="font-montserrat text-lg text-neutral-500 italic mt-8">
                            And we are only getting started.
                        </p>
                    </FadeIn>
                </div>
            </section>

            <Footer />
        </main>
    );
}
