"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WooCommerceProduct } from "@/lib/woocommerce";
import TextReveal from "../ui/TextReveal";
import ProductCard from "../ui/ProductCard";
import { useHomepageProducts } from "@/context/HomepageContext";

interface NewArrivalsProps {
    initialProducts?: WooCommerceProduct[];
}

export default function NewArrivals({ initialProducts }: NewArrivalsProps) {
    const { newArrivals } = useHomepageProducts();
    const displayProducts = newArrivals;

    return (
        <section className="bg-brand-black text-brand-white py-10 px-4 sm:px-6 md:py-20 md:px-12 lg:px-24 border-t border-white/10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-8 md:mb-14 gap-3 text-center w-full">
                    <div className="flex flex-col items-center w-full">
                        <span className="text-brand-green font-bold tracking-widest uppercase text-xs md:text-sm mb-1 block">Latest Drops</span>
                        <TextReveal
                            text="New Arrivals"
                            className="font-heading text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter justify-center w-full"
                        />
                        <p className="text-gray-400 mt-2 sm:mt-3 max-w-md font-sans text-center text-xs md:text-base mx-auto">
                            Explore our newest collection of elevated streetwear and premium lifestyle drops.
                        </p>
                    </div>
                    <Link 
                        href="/shop" 
                        className="group inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs md:text-sm text-brand-white hover:text-brand-green transition-colors border-b border-white/10 hover:border-brand-green pb-1 min-h-[44px] items-center"
                    >
                        View All Drops
                        <ArrowRight size={16} className="transform group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 md:gap-8">
                    {displayProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                        >
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.image}
                                tag={product.tag}
                                category={product.category}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

