"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import TextReveal from "../ui/TextReveal";

const categories = [
    { id: 1, name: "Men's Fashion", image: "/cat-mens.png", href: "/shop#mens", size: "large" },
    { id: 2, name: "Women's Fashion", image: "/cat-womens.png", href: "/shop#womens", size: "small" },
    { id: 3, name: "Kid's Fashion", image: "/cat-kids.png", href: "/shop#kids", size: "small" },
    { id: 4, name: "Home & Living", image: "/cat-home.png", href: "/shop#home-living", size: "medium" },
    { id: 5, name: "Accessories", image: "/cat-accessories.png", href: "/shop#accessories", size: "medium" },
];

export default function CategoryGrid() {
    return (
        <section className="bg-brand-white text-brand-black py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center justify-center mb-12 text-center w-full"
                >
                    <div className="flex flex-col items-center mb-4 w-full">
                        <span className="text-brand-green font-bold tracking-widest uppercase text-sm mb-2 block">Collections</span>
                        <TextReveal
                            text="Shop Collections"
                            className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter justify-center w-full"
                        />
                    </div>
                    <Link href="/collections" className="hidden md:inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm hover:text-brand-green transition-colors">
                        View All
                    </Link>
                </motion.div>

                {/* Mobile Carousel Layout */}
                <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 scrollbar-hide -mx-6 px-6">
                    {categories.map((cat, i) => (
                        <div
                            key={cat.id}
                            className="w-[85vw] shrink-0 snap-center h-[380px] relative overflow-hidden group rounded-[var(--radius-card)] bg-gray-900 border border-white/5"
                        >
                            <Link
                                href={cat.href}
                                className="absolute inset-0 w-full h-full"
                            >
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />

                                <div className="absolute bottom-0 left-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-white font-heading text-2xl font-bold tracking-widest uppercase mb-1">
                                        {cat.name}
                                    </h3>
                                    <span className="text-brand-green font-bold text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Explore Collection →
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Desktop 2x2 + Spanning Bottom Grid Layout */}
                <div className="hidden md:grid md:grid-cols-2 gap-6 auto-rows-[320px]">
                    {categories.map((cat, i) => {
                        const isLast = i === categories.length - 1;
                        return (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                                className={`relative overflow-hidden group rounded-[var(--radius-card)] bg-gray-900 border border-white/5 ${
                                    isLast ? "col-span-2" : "col-span-1"
                                }`}
                            >
                                <Link
                                    href={cat.href}
                                    className="absolute inset-0 w-full h-full"
                                >
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        sizes={isLast ? "100vw" : "50vw"}
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />

                                    <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-white font-heading text-2xl md:text-3xl font-bold tracking-widest uppercase mb-2">
                                            {cat.name}
                                        </h3>
                                        <span className="text-brand-green font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Explore Collection →
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
