"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import TextReveal from "../ui/TextReveal";

// 3D Tilt Card Component
function TiltCard({ children }: { children: React.ReactNode }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className="w-full h-full relative group cursor-pointer"
        >
            <div
                style={{
                    transform: "translateZ(30px)",
                    transformStyle: "preserve-3d",
                }}
                className="w-full h-full glass-card p-4 transition-shadow duration-300 group-hover:shadow-[0_20px_40px_rgba(177,243,16,0.15)]"
            >
                {children}
            </div>
        </motion.div>
    );
}

// Expanded Mock Data
const topProducts = [
    { id: "p1", name: "0-GRAVITY HOODIE", price: 120, image: "/prod-hoodie.png", tag: "NEW", category: "Mens" },
    { id: "p2", name: "VOID CARGO PANTS", price: 145, image: "/prod-cargo.png", tag: "", category: "Mens" },
    { id: "p3", name: "NEBULA OVERSIZED TEE", price: 65, image: "/prod-tee.png", tag: "BEST SELLER", category: "Womens" },
    { id: "p4", name: "STRUCTURAL JACKET", price: 210, image: "/prod-jacket.png", tag: "LIMITED", category: "Mens" },
    { id: "p5", name: "SYNTHETIC BEANIE", price: 35, image: "/prod-hoodie.png", tag: "", category: "Accessories" },
    { id: "p6", name: "TECH-WEAR SKIRT", price: 95, image: "/prod-cargo.png", tag: "NEW", category: "Womens" },
    { id: "p7", name: "HEAVY METAL CHAIN", price: 55, image: "/prod-tee.png", tag: "", category: "Accessories" },
    { id: "p8", name: "CYBERPUNK VEST", price: 180, image: "/prod-jacket.png", tag: "LIMITED", category: "Mens" },
    { id: "p9", name: "FUTURE YOUTH HOODIE", price: 75, image: "/prod-hoodie.png", tag: "NEW", category: "Kids" },
    { id: "p10", name: "NEO-CARGO SHORTS", price: 60, image: "/prod-cargo.png", tag: "", category: "Kids" },
    { id: "p11", name: "MINIMALIST RUG", price: 250, image: "/cat-home.png", tag: "BEST SELLER", category: "Home & Living" },
    { id: "p12", name: "STEEL DESK LAMP", price: 120, image: "/prod-jacket.png", tag: "LIMITED", category: "Home & Living" },
];

const categories = ["All", "Mens", "Womens", "Kids", "Home & Living", "Accessories"];

export default function BestSellers() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredProducts = topProducts.filter(
        (product) => activeCategory === "All" || product.category === activeCategory
    );
    return (
        <section className="bg-brand-black text-brand-white py-24 px-6 md:px-12 lg:px-24 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 text-center md:text-left"
                >
                    <div className="flex flex-col items-center md:items-start">
                        <TextReveal
                            text="Best Sellers"
                            className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter"
                        />
                        <p className="text-gray-400 mt-4 max-w-md font-sans">
                            Curated selection of our highest performing aesthetic structures.
                        </p>
                    </div>
                </motion.div>

                <div className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`relative px-6 py-2 rounded-[var(--radius-btn)] font-bold uppercase tracking-widest text-sm transition-colors duration-300 ${activeCategory === cat ? "text-brand-black" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 bg-brand-green rounded-[var(--radius-btn)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                            )}
                            <span className="relative z-10">{cat}</span>
                        </button>
                    ))}
                </div>

                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="perspective-1000"
                            >
                                <TiltCard>
                                    <div className="relative aspect-[3/4] bg-white/5 rounded-[var(--radius-img)] overflow-hidden mb-6 flex items-center justify-center">
                                        {/* Product Image */}
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />

                                        {product.tag && (
                                            <span className="absolute top-4 left-4 bg-brand-green text-brand-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
                                                {product.tag}
                                            </span>
                                        )}

                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <button className="bg-brand-white text-brand-black font-bold uppercase tracking-widest px-6 py-3 rounded-[var(--radius-btn)] hover:bg-brand-green transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
                                                Quick Add
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-2">
                                        <div className="flex items-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className="fill-brand-green text-brand-green" />
                                            ))}
                                            <span className="text-xs text-gray-400 ml-2">(124)</span>
                                        </div>
                                        <Link href={`/product/${product.id}`} className="block">
                                            <h3 className="font-bold text-lg hover:text-brand-green transition-colors uppercase font-heading">{product.name}</h3>
                                        </Link>
                                        <div className="mt-2 text-brand-green font-bold tracking-widest">
                                            ${product.price}.00
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
