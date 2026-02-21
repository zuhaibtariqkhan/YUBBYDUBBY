"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

// Mock Data for now
const topProducts = [
    { id: "p1", name: "0-GRAVITY HOODIE", price: 120, image: "/prod-hoodie.png", tag: "NEW" },
    { id: "p2", name: "VOID CARGO PANTS", price: 145, image: "/prod-cargo.png", tag: "" },
    { id: "p3", name: "NEBULA OVERSIZED TEE", price: 65, image: "/prod-tee.png", tag: "BEST SELLER" },
    { id: "p4", name: "STRUCTURAL JACKET", price: 210, image: "/prod-jacket.png", tag: "LIMITED" },
];

export default function BestSellers() {
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
                        <h2 className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter">Best Sellers</h2>
                        <p className="text-gray-400 mt-4 max-w-md font-sans">
                            Curated selection of our highest performing aesthetic structures.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {topProducts.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                            className="glass-card p-4 group cursor-pointer"
                        >
                            <div className="relative aspect-[3/4] bg-white/5 rounded-[var(--radius-img)] overflow-hidden mb-6 flex items-center justify-center">
                                {/* Product Image */}
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
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
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
