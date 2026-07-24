"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WooCommerceProduct } from "@/lib/woocommerce";
import TextReveal from "../ui/TextReveal";
import ProductCard from "../ui/ProductCard";

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
        <section className="bg-brand-white text-brand-black py-12 md:py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-10 md:mb-16 gap-4 text-center w-full">
                    <div className="flex flex-col items-center w-full">
                        <span className="text-brand-green font-bold tracking-widest uppercase text-xs md:text-sm mb-1 md:mb-2 block">Studio Curation</span>
                        <TextReveal
                            text="Featured Products"
                            className="font-heading text-3xl md:text-6xl font-black uppercase tracking-tighter justify-center w-full"
                        />
                        <p className="text-gray-500 mt-4 max-w-md font-sans text-center text-xs md:text-base mx-auto">
                            Handpicked structural coordinates demonstrating elite street aesthetics.
                        </p>
                    </div>
                    <Link 
                        href="/shop" 
                        className="group inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm hover:text-brand-green transition-colors border-b-2 border-brand-black hover:border-brand-green pb-1"
                    >
                        Explore Entire Shop
                        <ArrowRight size={18} className="transform group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {displayProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
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

