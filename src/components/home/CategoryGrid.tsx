"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import TextReveal from "../ui/TextReveal";

const categories = [
    { id: 1, name: "Men's Fashion", image: "/cat-mens.png", href: "/men", size: "large" },
    { id: 2, name: "Women's Fashion", image: "/cat-womens.png", href: "/women", size: "small" },
    { id: 3, name: "Kid's Fashion", image: "/cat-kids.png", href: "/kids", size: "small" },
    { id: 4, name: "Home & Living", image: "/cat-home.png", href: "/home-living", size: "medium" },
    { id: 5, name: "Accessories", image: "/cat-accessories.png", href: "/accessories", size: "medium" },
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
                            text="Shop By Category"
                            className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter justify-center w-full"
                        />
                    </div>
                    <Link href="/collections" className="hidden md:inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm hover:text-brand-green transition-colors">
                        View All
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                            className={`relative overflow-hidden group rounded-[var(--radius-card)] bg-gray-100 ${cat.size === "large" ? "md:col-span-2 md:row-span-2" :
                                cat.size === "medium" ? "md:col-span-2" : "md:col-span-1"
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
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

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
                    ))}
                </div>
            </div>
        </section>
    );
}
