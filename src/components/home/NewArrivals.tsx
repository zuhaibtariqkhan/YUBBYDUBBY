"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WooCommerceProduct } from "@/lib/woocommerce";
import TextReveal from "../ui/TextReveal";

interface NewArrivalsProps {
    initialProducts?: WooCommerceProduct[];
}

const mockNew = [
    { id: "p18", name: "METROPOLIS OVERCOAT", price: 280, image: "/prod-jacket.png", tag: "NEW", category: "Mens", desc: "Longline structured technical overcoat with water-resistant shell plating and heavy insulation." },
    { id: "p6", name: "TECH-WEAR SKIRT", price: 95, image: "/prod-cargo.png", tag: "NEW", category: "Womens", desc: "Asymmetric micro-grid panel skirt with quick-release nylon buckle." },
    { id: "p9", name: "FUTURE YOUTH HOODIE", price: 75, image: "/prod-hoodie.png", tag: "NEW", category: "Kids", desc: "Premium streetwear sizing for the next generation. Soft loopback terry." },
    { id: "p13", name: "CYBERPUNK IPHONE CASE", price: 40, image: "/prod-phone-case.png", tag: "NEW", category: "Accessories", desc: "iPhone case featuring high-contrast streetwear prints and modular graphics." }
];

export default function NewArrivals({ initialProducts }: NewArrivalsProps) {
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
                tag: "NEW",
                category: prod.categories[0]?.name || "Clothing",
                desc: prod.short_description || "Premium new arrival addition to the Yubby Dubby collection structure."
            };
        })
        : mockNew;

    const featuredProduct = displayProducts[0];
    const secondaryProducts = displayProducts.slice(1);

    return (
        <section className="bg-brand-black text-brand-white py-24 px-6 md:px-12 lg:px-24 border-t border-white/10 relative overflow-hidden">
            
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-radial from-[#B1F310]/3 via-transparent to-transparent blur-[120px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-brand-green font-bold tracking-widest uppercase text-sm mb-2 block">Latest Drops</span>
                        <TextReveal
                            text="New Arrivals"
                            className="font-heading text-5xl md:text-6xl font-black uppercase tracking-tighter"
                        />
                        <p className="text-gray-400 mt-4 max-w-md font-sans">
                            Freshly synthesized coordinates constructed for immediate deployment.
                        </p>
                    </div>
                    <Link 
                        href="/shop" 
                        className="group inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm hover:text-brand-green transition-colors border-b border-white/10 hover:border-brand-green pb-2"
                    >
                        View All Drops
                        <ArrowRight size={18} className="transform group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                </div>

                {/* Split layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Left: Large Editorial Card (Featured New Product) */}
                    {featuredProduct && (
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="lg:col-span-7 glass-card p-6 md:p-8 flex flex-col justify-between group relative overflow-hidden min-h-[500px]"
                        >
                            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 group-hover:border-brand-green/30 rounded-tl-[var(--radius-card)] transition-colors" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/10 group-hover:border-brand-green/30 rounded-br-[var(--radius-card)] transition-colors" />

                            <div className="relative aspect-[4/3] w-full bg-white/5 rounded-[var(--radius-img)] overflow-hidden mb-6 flex items-center justify-center">
                                <Link href={`/product/${featuredProduct.id}`} className="absolute inset-0 w-full h-full block z-0">
                                    <Image
                                        src={featuredProduct.image}
                                        alt={featuredProduct.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                </Link>
                                <span className="absolute top-4 left-4 bg-brand-green text-brand-black text-xs font-bold px-3 py-1 uppercase tracking-widest z-10 pointer-events-none">
                                    {featuredProduct.tag}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <span className="text-brand-green text-xs font-mono uppercase tracking-widest">{featuredProduct.category}</span>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className="fill-brand-green text-brand-green" />
                                        ))}
                                        <span className="text-xs text-gray-400 ml-1 font-mono">(14)</span>
                                    </div>
                                </div>
                                
                                <Link href={`/product/${featuredProduct.id}`} className="block">
                                    <h3 className="font-heading text-3xl font-black tracking-widest uppercase hover:text-brand-green transition-colors leading-none">
                                        {featuredProduct.name}
                                    </h3>
                                </Link>
                                
                                <p className="text-gray-400 text-sm font-sans line-clamp-2 max-w-xl">
                                    {featuredProduct.desc}
                                </p>
                                
                                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                                    <span className="text-brand-green text-2xl font-bold tracking-widest">${featuredProduct.price}.00</span>
                                    <button
                                        onClick={() => addToCart({
                                            id: featuredProduct.id,
                                            name: featuredProduct.name,
                                            price: featuredProduct.price,
                                            size: "M",
                                            image: featuredProduct.image
                                        }, 1)}
                                        className="bg-brand-white text-brand-black font-bold uppercase tracking-widest text-xs px-6 py-4 rounded-[var(--radius-btn)] hover:bg-brand-green hover:shadow-[0_0_20px_rgba(177,243,16,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <ShoppingBag size={16} />
                                        Add to Bag
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Right: Stack of 3 secondary items */}
                    <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                        {secondaryProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
                                className="glass-card p-4 flex gap-4 items-center group relative overflow-hidden flex-grow"
                            >
                                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/10 group-hover:border-brand-green/20 rounded-tl-[var(--radius-card)] transition-colors" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/10 group-hover:border-brand-green/20 rounded-br-[var(--radius-card)] transition-colors" />

                                {/* Product Image Thumbnail */}
                                <div className="relative h-28 w-24 shrink-0 bg-white/5 rounded-[var(--radius-img)] overflow-hidden flex items-center justify-center">
                                    <Link href={`/product/${product.id}`} className="absolute inset-0 w-full h-full block z-0">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="100px"
                                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    </Link>
                                </div>

                                {/* Details */}
                                <div className="flex-grow flex flex-col justify-between h-full min-w-0">
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="text-gray-400 text-[10px] font-mono uppercase tracking-widest">{product.category}</span>
                                            <span className="bg-brand-green/10 text-brand-green text-[9px] font-bold px-2 py-0.5 rounded font-mono">NEW</span>
                                        </div>
                                        <Link href={`/product/${product.id}`} className="block">
                                            <h4 className="font-heading font-black text-base tracking-widest uppercase hover:text-brand-green transition-colors truncate">
                                                {product.name}
                                            </h4>
                                        </Link>
                                        <span className="text-brand-green text-sm font-bold tracking-widest">${product.price}.00</span>
                                    </div>
                                    
                                    <div className="mt-2 pt-2 border-t border-white/5 flex justify-end">
                                        <button
                                            onClick={() => addToCart({
                                                id: product.id,
                                                name: product.name,
                                                price: product.price,
                                                size: "M",
                                                image: product.image
                                            }, 1)}
                                            className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-brand-green transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                            Quick Add +
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                </div>
                
            </div>
        </section>
    );
}
