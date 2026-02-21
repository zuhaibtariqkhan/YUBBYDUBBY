"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const categories = [
    { id: 1, name: "Men's Fashion", image: "/placeholder-cat1.jpg", href: "/men", size: "large" },
    { id: 2, name: "Women's Fashion", image: "/placeholder-cat2.jpg", href: "/women", size: "small" },
    { id: 3, name: "Kid's Fashion", image: "/placeholder-cat3.jpg", href: "/kids", size: "small" },
    { id: 4, name: "Home & Living", image: "/placeholder-cat4.jpg", href: "/home-living", size: "medium" },
    { id: 5, name: "Accessories", image: "/placeholder-cat5.jpg", href: "/accessories", size: "medium" },
];

export default function CategoryGrid() {
    return (
        <section className="bg-brand-white text-brand-black py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-brand-green font-bold tracking-widest uppercase text-sm mb-2 block">Collections</span>
                        <h2 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter">Shop By Category</h2>
                    </div>
                    <Link href="/collections" className="hidden md:inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm hover:text-brand-green transition-colors">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
                    {categories.map((cat, i) => (
                        <Link
                            key={cat.id}
                            href={cat.href}
                            className={`relative overflow-hidden group rounded-[var(--radius-card)] bg-gray-100 ${cat.size === "large" ? "md:col-span-2 md:row-span-2" :
                                cat.size === "medium" ? "md:col-span-2" : "md:col-span-1"
                                }`}
                        >
                            {/* Image Placeholder (replace with actual next/image when assets are ready) */}
                            <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center">
                                <span className="text-gray-400 font-bold">Image: {cat.name}</span>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                            <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-brand-white font-heading text-3xl uppercase tracking-wider">{cat.name}</h3>
                                <p className="text-brand-white/0 group-hover:text-brand-green transition-all duration-300 mt-2 font-bold tracking-widest text-sm uppercase">Shop Now →</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
