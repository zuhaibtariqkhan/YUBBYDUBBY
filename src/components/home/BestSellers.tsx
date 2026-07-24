"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextReveal from "../ui/TextReveal";
import ProductCard from "../ui/ProductCard";
import { WooCommerceProduct } from "@/lib/woocommerce";

// Expanded Mock Data
const mockProducts = [
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
    { id: "p13", name: "CYBERPUNK IPHONE CASE", price: 40, image: "/prod-phone-case.png", tag: "NEW", category: "Accessories" },
    { id: "p14", name: "CYBERPUNK AIRPODS COVER", price: 30, image: "/prod-airpods-cover.png", tag: "NEW", category: "Accessories" },
    { id: "p15", name: "STREETWEAR SNAPBACK CAP", price: 45, image: "/prod-cap.png", tag: "POPULAR", category: "Accessories" },
    { id: "p16", name: "TECHWEAR SUNGLASSES", price: 60, image: "/prod-sunglasses.png", tag: "LIMITED", category: "Accessories" },
    { id: "p17", name: "AESTHETIC STICKER PACK", price: 15, image: "/prod-stickers.png", tag: "BUDGET", category: "Accessories" },
    { id: "p18", name: "METROPOLIS OVERCOAT", price: 280, image: "/prod-jacket.png", tag: "NEW", category: "Mens" },
    { id: "p19", name: "GRAVITY CROPPED ZIP-UP", price: 110, image: "/prod-hoodie.png", tag: "POPULAR", category: "Womens" },
    { id: "p20", name: "VOID PANEL LEGGINGS", price: 85, image: "/prod-cargo.png", tag: "", category: "Womens" },
    { id: "p21", name: "CYBERPUNK YOUTH TEE", price: 45, image: "/prod-tee.png", tag: "BEST SELLER", category: "Kids" },
    { id: "p22", name: "GRID PATTERN CUSHION", price: 50, image: "/cat-home.png", tag: "NEW", category: "Home & Living" },
];

const categories = ["All", "Mens", "Womens", "Kids", "Home & Living", "Accessories"];

interface BestSellersProps {
    initialProducts?: WooCommerceProduct[];
}

export default function BestSellers({ initialProducts }: BestSellersProps) {
    const [activeCategory, setActiveCategory] = useState("All");

    const topProducts = initialProducts && initialProducts.length > 0
        ? initialProducts.map(prod => {
            let category = "Accessories";
            const catSlugs = prod.categories.map(c => c.slug.toLowerCase());
            if (catSlugs.some(s => s.includes("men"))) category = "Mens";
            else if (catSlugs.some(s => s.includes("women"))) category = "Womens";
            else if (catSlugs.some(s => s.includes("kid"))) category = "Kids";
            else if (catSlugs.some(s => s.includes("home") || s.includes("living"))) category = "Home & Living";
            else if (prod.categories.length > 0) {
                const name = prod.categories[0].name;
                category = name.charAt(0).toUpperCase() + name.slice(1);
            }

            let tag = "";
            if (prod.on_sale) {
                tag = "SALE";
            } else if (prod.tags.some(t => t.slug.includes("new"))) {
                tag = "NEW";
            } else if (prod.tags.some(t => t.slug.includes("best-seller") || t.slug.includes("featured"))) {
                tag = "BEST SELLER";
            } else if (prod.tags.some(t => t.slug.includes("limited"))) {
                tag = "LIMITED";
            }

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
                tag,
                category
            };
        })
        : mockProducts;

    const filteredProducts = topProducts.filter(
        (product) => activeCategory === "All" || product.category === activeCategory
    );
    return (
        <section className="bg-brand-black text-brand-white py-10 px-4 sm:px-6 md:py-20 md:px-12 lg:px-24 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center mb-6 md:mb-10 text-center w-full"
                >
                    <div className="flex flex-col items-center w-full">
                        <TextReveal
                            text="Shop By Category"
                            className="font-heading text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter justify-center w-full"
                        />
                        <p className="text-gray-400 mt-2 sm:mt-3 max-w-md font-sans text-center text-xs md:text-base mx-auto">
                            Curated selection of our highest performing aesthetic structures.
                        </p>
                    </div>
                </motion.div>

                {/* Touch-Friendly Edge-to-Edge Category Filter Scrollbar */}
                <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide gap-2.5 mb-6 md:mb-10 justify-start md:justify-center pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x items-center">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`relative min-h-[44px] px-5 py-2 rounded-[var(--radius-btn)] font-bold uppercase tracking-widest text-xs transition-colors duration-300 shrink-0 snap-start flex items-center justify-center cursor-pointer ${activeCategory === cat ? "text-brand-black" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 bg-brand-green rounded-[var(--radius-btn)]"
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                />
                            )}
                            <span className="relative z-10">{cat}</span>
                        </button>
                    ))}
                </div>

                <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 md:gap-8 min-h-[300px] md:min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
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
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
