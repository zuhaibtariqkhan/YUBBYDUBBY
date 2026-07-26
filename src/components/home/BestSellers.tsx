"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextReveal from "../ui/TextReveal";
import ProductCard from "../ui/ProductCard";
import { WooCommerceProduct } from "@/lib/woocommerce";
import { PackageSearch } from "lucide-react";
import { useHomepageProducts } from "@/context/HomepageContext";

interface CategoryTab {
    label: string;
    slug: string;
}

const CATEGORY_TABS: CategoryTab[] = [
    { label: "All", slug: "all" },
    { label: "Men", slug: "mens" },
    { label: "Women", slug: "womens" },
    { label: "Kids", slug: "kids" },
    { label: "Home & Living", slug: "home-living" },
    { label: "Accessories", slug: "accessories" },
];

interface BestSellersProps {
    initialProducts?: WooCommerceProduct[];
}

export default function BestSellers({ initialProducts }: BestSellersProps) {
    const [activeTab, setActiveTab] = useState<CategoryTab>(CATEGORY_TABS[0]);
    const { categoryProducts, isLoading } = useHomepageProducts();

    const displayedProducts = categoryProducts[activeTab.slug] || [];

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

                {/* Touch-Friendly Edge-to-Edge Category Filter Bar */}
                <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide gap-2.5 mb-6 md:mb-10 justify-start md:justify-center pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x items-center">
                    {CATEGORY_TABS.map((tab) => (
                        <button
                            key={tab.slug}
                            onClick={() => setActiveTab(tab)}
                            className={`relative min-h-[44px] px-5 py-2 rounded-[var(--radius-btn)] font-bold uppercase tracking-widest text-xs transition-colors duration-300 shrink-0 snap-start flex items-center justify-center cursor-pointer ${
                                activeTab.slug === tab.slug ? "text-brand-black" : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {activeTab.slug === tab.slug && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 bg-brand-green rounded-[var(--radius-btn)]"
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Dynamic Product Container */}
                <div className="min-h-[350px] md:min-h-[420px]">
                    {isLoading ? (
                        /* Loading Skeleton Grid */
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 md:gap-8">
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <div key={idx} className="flex flex-col space-y-3">
                                    <div className="aspect-[4/5] w-full bg-white/5 border border-white/10 rounded-[var(--radius-img)] animate-pulse" />
                                    <div className="h-3 w-1/3 bg-white/5 rounded animate-pulse" />
                                    <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                                    <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : displayedProducts.length === 0 ? (
                        /* Clean Empty State */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-16 flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.02] border border-white/10 rounded-[var(--radius-card)] p-8 my-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center text-brand-green">
                                <PackageSearch size={32} />
                            </div>
                            <div className="space-y-1 max-w-sm">
                                <h3 className="font-heading font-bold text-base md:text-lg uppercase tracking-wider text-white">
                                    {activeTab.slug === "mens" ? "No Men's products available." : `No products available in ${activeTab.label}.`}
                                </h3>
                                <p className="text-gray-400 text-xs font-sans leading-relaxed">
                                    We couldn&apos;t find any active products in {activeTab.label} right now. Check back soon for new drop coordinates.
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveTab(CATEGORY_TABS[0])}
                                className="px-6 py-2.5 bg-brand-green text-brand-black text-xs font-bold uppercase tracking-widest rounded-[var(--radius-btn)] hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.4)] transition-all cursor-pointer mt-2"
                            >
                                Browse All Categories
                            </button>
                        </motion.div>
                    ) : (
                        /* Product Grid */
                        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 md:gap-8">
                            <AnimatePresence mode="popLayout">
                                {displayedProducts.map((product) => (
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
                                            regularPrice={product.regularPrice}
                                            image={product.image}
                                            tag={product.tag}
                                            category={product.category}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}

