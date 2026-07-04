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
                className="w-full h-full bg-transparent border-none md:glass-card p-0 md:p-4 transition-shadow duration-300 group-hover:shadow-[0_20px_40px_rgba(177,243,16,0.15)]"
            >
                {children}
            </div>
        </motion.div>
    );
}

import { WooCommerceProduct } from "@/lib/woocommerce";

import { useCart } from "@/context/CartContext";

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
    const { addToCart } = useCart();

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
        <section className="bg-brand-black text-brand-white py-12 md:py-24 px-6 md:px-12 lg:px-24 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-8 md:mb-16 text-center w-full"
                >
                    <div className="flex flex-col items-center w-full">
                        <TextReveal
                            text="Shop By Category"
                            className="font-heading text-3xl md:text-6xl font-black uppercase tracking-tighter justify-center w-full"
                        />
                        <p className="text-gray-400 mt-4 max-w-md font-sans text-center text-xs md:text-base mx-auto">
                            Curated selection of our highest performing aesthetic structures.
                        </p>
                    </div>
                </motion.div>

                <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide gap-3 mb-8 md:mb-12 justify-start md:justify-center pb-3 -mx-6 px-6 snap-x">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`relative px-4 py-1.5 rounded-[var(--radius-btn)] font-bold uppercase tracking-widest text-xs transition-colors duration-300 shrink-0 snap-start ${activeCategory === cat ? "text-brand-black" : "text-gray-400 hover:text-white"
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

                <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 min-h-[300px] md:min-h-[400px]">
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
                                    <div className="relative aspect-[3/4] bg-white/5 rounded-[12px] sm:rounded-[var(--radius-img)] overflow-hidden mb-3 sm:mb-6 flex items-center justify-center">
                                        {/* Product Image Link */}
                                        <Link href={`/product/${product.id}`} className="absolute inset-0 w-full h-full block z-0">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                        </Link>

                                        {product.tag && (
                                            <span className="absolute top-2 left-2 bg-brand-green text-brand-black text-[9px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 uppercase tracking-widest z-10 pointer-events-none">
                                                {product.tag}
                                            </span>
                                        )}

                                        <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center z-10 pointer-events-none">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart({
                                                        id: product.id,
                                                        name: product.name,
                                                        price: product.price,
                                                        size: "M",
                                                        image: product.image
                                                    }, 1);
                                                }}
                                                className="bg-brand-white text-brand-black font-bold uppercase tracking-widest px-6 py-3 rounded-[var(--radius-btn)] hover:bg-brand-green transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer pointer-events-auto"
                                            >
                                                Quick Add
                                            </button>
                                        </div>
                                    </div>


                                    <div className="px-0 sm:px-2">
                                        <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} className="fill-brand-green text-brand-green sm:w-3.5 sm:h-3.5" />
                                            ))}
                                            <span className="text-[10px] sm:text-xs text-gray-400 ml-1.5 sm:ml-2">(124)</span>
                                        </div>
                                        <Link href={`/product/${product.id}`} className="block">
                                            <h3 className="font-bold text-xs sm:text-base md:text-lg hover:text-brand-green transition-colors uppercase font-heading truncate">{product.name}</h3>
                                        </Link>
                                        <div className="mt-1 sm:mt-2 text-brand-green font-bold tracking-widest text-xs sm:text-base">
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
