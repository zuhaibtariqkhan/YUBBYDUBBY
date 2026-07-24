"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import TextReveal from "../ui/TextReveal";
import CategoryCard from "../ui/CategoryCard";

const categories = [
    { id: 1, name: "Men's Fashion", image: "/cat-mens.png", href: "/shop?category=mens" },
    { id: 2, name: "Women's Fashion", image: "/cat-womens.png", href: "/shop?category=womens" },
    { id: 3, name: "Kid's Fashion", image: "/cat-kids.png", href: "/shop?category=kids" },
    { id: 4, name: "Home & Living", image: "/cat-home.png", href: "/shop?category=home-living" },
    { id: 5, name: "Accessories", image: "/cat-accessories.png", href: "/shop?category=accessories" },
];

export default function CategoryGrid() {
    return (
        <section className="bg-brand-white text-brand-black py-10 px-4 sm:px-6 md:py-20 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center mb-8 md:mb-14 text-center w-full"
                >
                    <div className="flex flex-col items-center mb-1 md:mb-3 w-full">
                        <span className="text-brand-green font-bold tracking-widest uppercase text-xs md:text-sm mb-1 block">Collections</span>
                        <TextReveal
                            text="Shop Collections"
                            className="font-heading text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter justify-center w-full"
                        />
                    </div>
                    <Link href="/shop" className="hidden md:inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs md:text-sm hover:text-brand-green transition-colors mt-2">
                        View All
                    </Link>
                </motion.div>

                {/* Grid of Equal-Dimension Category Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6 md:gap-8">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                        >
                            <CategoryCard
                                name={cat.name}
                                image={cat.image}
                                href={cat.href}
                                countText="Explore Collection"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

