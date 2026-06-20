"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WooCommerceProduct } from "@/lib/woocommerce";
import TextReveal from "../ui/TextReveal";

interface FeaturedProductsProps {
    initialProducts?: WooCommerceProduct[];
}

const mockFeatured = [
    { id: "p1", name: "0-GRAVITY HOODIE", price: 120, image: "/prod-hoodie.png", tag: "HOT", category: "Mens" },
    { id: "p2", name: "VOID CARGO PANTS", price: 145, image: "/prod-cargo.png", tag: "ESSENTIAL", category: "Mens" },
    { id: "p16", name: "TECHWEAR SUNGLASSES", price: 60, image: "/prod-sunglasses.png", tag: "LIMITED", category: "Accessories" },
    { id: "p4", name: "STRUCTURAL JACKET", price: 210, image: "/prod-jacket.png", tag: "EXCLUSIVE", category: "Mens" }
];

export default function FeaturedProducts({ initialProducts }: FeaturedProductsProps) {
    const { addToCart } = useCart();

    const displayProducts = initialProducts && initialProducts.length > 0
        ? initialProducts.slice(0, 4).map(prod => {
            let image = prod.images[0]?.src || "/prod-hoodie.png";
            const lowerName = prod.name.toLowerCase();
            if (lowerName.includes("iphone") || lowerName.includes("phone") || lowerName.includes("case")) {
                image = "/prod-phone-case.png";
            } else if (lowerName.includes("airpod")) {
                image = "/prod-airpods-cover.png";
            } else if (lowerName.includes("cap") || lowerName.includes("hat")) {
                image = "/prod-cap.png";
            } else if (lowerName.includes("sunglass") || lowerName.includes("glasses")) {
                image = "/prod-sunglasses.png";
            } else if (lowerName.includes("sticker")) {
                image = "/prod-stickers.png";
            }

            return {
                id: prod.id.toString(),
                name: prod.name.toUpperCase(),
                price: parseFloat(prod.price) || 0,
                image,
                tag: prod.on_sale ? "SALE" : "FEATURED",
                category: prod.categories[0]?.name || "Accessories"
            };
        })
        : mockFeatured;

    return (
        <section className="bg-brand-white text-brand-black py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-brand-green font-bold tracking-widest uppercase text-sm mb-2 block">Studio Curation</span>
                        <TextReveal
                            text="Featured Products"
                            className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter"
                        />
                        <p className="text-gray-500 mt-4 max-w-md font-sans">
                            Handpicked structural coordinates demonstrating elite street aesthetics.
                        </p>
                    </div>
                    <Link 
                        href="/shop" 
                        className="group inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm hover:text-brand-green transition-colors border-b-2 border-brand-black hover:border-brand-green pb-2"
                    >
                        Explore Entire Shop
                        <ArrowRight size={18} className="transform group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
                            className="bg-black/5 border border-black/5 rounded-[var(--radius-card)] p-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="relative aspect-[3/4] bg-black/5 rounded-[var(--radius-img)] overflow-hidden mb-6 flex items-center justify-center">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    {product.tag && (
                                        <span className="absolute top-4 left-4 bg-brand-black text-brand-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-white/10">
                                            {product.tag}
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button 
                                            onClick={() => addToCart({
                                                id: product.id,
                                                name: product.name,
                                                price: product.price,
                                                size: "M",
                                                image: product.image
                                            }, 1)}
                                            className="bg-brand-green text-brand-black font-bold uppercase tracking-widest px-6 py-3 rounded-[var(--radius-btn)] hover:bg-white hover:text-black transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer"
                                        >
                                            Quick Add
                                        </button>
                                    </div>
                                </div>

                                <div className="px-2">
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={13} className="fill-brand-green text-brand-green" />
                                        ))}
                                        <span className="text-[10px] text-gray-400 ml-1 font-mono">(98)</span>
                                    </div>
                                    <Link href={`/product/${product.id}`} className="block">
                                        <h3 className="font-bold text-lg hover:text-brand-green transition-colors uppercase font-heading truncate text-brand-black">{product.name}</h3>
                                    </Link>
                                </div>
                            </div>
                            <div className="px-2 mt-4 pt-4 border-t border-black/5 flex justify-between items-center">
                                <span className="text-gray-400 text-xs font-mono uppercase">{product.category}</span>
                                <span className="text-brand-black font-bold tracking-widest">
                                    ${product.price}.00
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
