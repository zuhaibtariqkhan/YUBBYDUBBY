"use client";

import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import TextReveal from "@/components/ui/TextReveal";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { Instagram, Facebook, Gem, Truck, Heart, Palette, ShieldCheck, Sparkles } from "lucide-react";

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

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const increment = target / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [isInView, target, duration]);

    return { ref, count };
}

// Stats data
const stats = [
    { value: 4, suffix: "+", label: "Years of Passion", description: "Crafting premium experiences" },
    { value: 500, suffix: "+", label: "Products", description: "Across lifestyle categories" },
    { value: 10000, suffix: "+", label: "Happy Customers", description: "And growing every day" },
    { value: 50, suffix: "+", label: "Categories", description: "Fashion, home & beyond" },
];

// Brand values data
const brandValues = [
    {
        icon: Gem,
        title: "Premium Quality",
        description: "Every product undergoes rigorous quality checks to ensure exceptional craftsmanship.",
        gradient: "from-violet-500 to-purple-600"
    },
    {
        icon: Heart,
        title: "Customer First",
        description: "Your satisfaction drives everything we do — from design to delivery.",
        gradient: "from-rose-500 to-pink-600"
    },
    {
        icon: Palette,
        title: "Design Excellence",
        description: "Merging modern aesthetics with timeless appeal in every collection.",
        gradient: "from-amber-500 to-orange-600"
    },
    {
        icon: ShieldCheck,
        title: "Trust & Integrity",
        description: "Transparent pricing, honest quality — no compromises, ever.",
        gradient: "from-emerald-500 to-green-600"
    },
    {
        icon: Truck,
        title: "Reliable Delivery",
        description: "Fast, secure shipping so your order reaches you in perfect condition.",
        gradient: "from-sky-500 to-blue-600"
    },
    {
        icon: Sparkles,
        title: "Affordable Luxury",
        description: "Premium living shouldn't cost a fortune — we make it accessible.",
        gradient: "from-yellow-400 to-amber-500"
    },
];

// Stat Card Component
const StatCard = ({ value, suffix, label, description, index }: { value: number; suffix: string; label: string; description: string; index: number }) => {
    const { ref, count } = useAnimatedCounter(value, 2);
    const displayCount = value >= 10000 ? `${Math.floor(count / 1000)}k` : count;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-center group"
        >
            <div className="relative mb-3">
                <span className="font-oswald text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight">
                    {displayCount}
                </span>
                <span className="font-oswald text-3xl sm:text-4xl md:text-5xl font-black text-[#b1f310]">{suffix}</span>
            </div>
            <p className="font-oswald text-sm sm:text-base md:text-lg uppercase tracking-[0.2em] text-white mb-1">{label}</p>
            <p className="font-montserrat text-xs sm:text-sm text-neutral-500">{description}</p>
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
                        <span className="text-[#b1f310]">
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
                            Yubby Dubby is a contemporary <span className="whitespace-nowrap">e-commerce</span> brand built on a powerful belief <span className="text-white font-medium">premium quality should be accessible, not exclusive.</span>
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

            {/* Animated Stats Section */}
            <section className="py-20 sm:py-28 md:py-32 relative z-10 bg-brand-black overflow-hidden">
                {/* Subtle background accents */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#b1f310]/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-[120px]" />
                </div>
                <div className="container mx-auto px-4 max-w-6xl relative">
                    <FadeIn className="text-center mb-16 sm:mb-20">
                        <h2 className="font-oswald text-sm md:text-base uppercase tracking-[0.3em] text-neutral-500 mb-4">By the Numbers</h2>
                        <p className="font-montserrat text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto">Our growth tells a story of relentless dedication and unwavering commitment.</p>
                    </FadeIn>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
                        {stats.map((stat, i) => (
                            <StatCard key={stat.label} {...stat} index={i} />
                        ))}
                    </div>
                    {/* Decorative divider */}
                    <div className="mt-16 sm:mt-20 flex justify-center">
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />
                    </div>
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

            {/* Brand Values Section */}
            <section className="py-20 sm:py-28 md:py-32 relative z-10 bg-brand-black overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#b1f310]/3 rounded-full blur-[150px]" />
                    <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/3 rounded-full blur-[150px]" />
                </div>
                <div className="container mx-auto px-4 max-w-6xl relative">
                    <FadeIn className="text-center mb-16 sm:mb-20">
                        <h2 className="font-oswald text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4">
                            OUR VALUES
                        </h2>
                        <p className="font-montserrat text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
                            The principles that guide every decision, every design, and every delivery.
                        </p>
                    </FadeIn>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                        {brandValues.map((value, i) => {
                            const IconComponent = value.icon;
                            return (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                                    className="group relative p-6 sm:p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm hover:border-neutral-700 transition-all duration-500 hover:bg-neutral-900/80"
                                >
                                    {/* Hover glow */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500`} />

                                    <div className="relative z-10">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={1.5} />
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-oswald text-lg sm:text-xl uppercase tracking-wider text-white mb-2 sm:mb-3">
                                            {value.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="font-montserrat text-sm sm:text-[15px] text-neutral-400 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>

                                    {/* Corner accent */}
                                    <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-bl ${value.gradient} opacity-[0.03] group-hover:opacity-[0.08] rounded-tr-2xl rounded-bl-[40px] transition-opacity duration-500`} />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Founder Section */}
            <section className="py-24 relative z-10 bg-brand-black">
                <div className="container mx-auto px-4 flex flex-col items-center">
                    <FadeIn className="w-full text-center">
                        <h2 className="font-oswald text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-24">
                            FOUNDER
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <ProfileCard
                            name="Zuhaib Tariq Khan"
                            title="Founder"
                            avatarUrl="/ZTKKK.jpeg"
                            handle="zuhaibtariqkhan"
                            status="Entrepreneur"
                            contactText="Get in Touch"
                            onContactClick={() => window.open("https://www.instagram.com/zuhaibtariqkhan/", "_blank")}
                            socials={
                                <>
                                    <a
                                        href="https://www.instagram.com/zuhaibtariqkhan/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-white hover:text-brand-green transition-colors cursor-pointer pointer-events-auto"
                                    >
                                        <Instagram size={24} />
                                    </a>
                                    <a
                                        href="https://www.facebook.com/zuhaibtariqkhan/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-white hover:text-brand-green transition-colors cursor-pointer pointer-events-auto"
                                    >
                                        <Facebook size={24} />
                                    </a>
                                </>
                            }
                        />
                    </FadeIn>
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
