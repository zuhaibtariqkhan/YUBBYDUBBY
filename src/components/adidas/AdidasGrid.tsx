"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface AdidasProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  tag: string;
  category: string;
}

interface AdidasGridProps {
  products: AdidasProduct[];
}

export default function AdidasGrid({ products }: AdidasGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  // Dynamically extract unique categories from products
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  // Filter products by selected category
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-10">
      {/* Category Tabs Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2.5 justify-center bg-white/5 border border-white/5 p-1 rounded-full text-xs font-mono max-w-2xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-6 py-2.5 rounded-full cursor-pointer transition-colors duration-300 uppercase tracking-widest text-[10px] font-bold ${
                activeCategory === cat ? "text-brand-black" : "text-gray-400 hover:text-white"
              }`}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeAdidasFilter"
                  className="absolute inset-0 bg-brand-green rounded-full z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <p className="text-sm text-gray-500 italic text-center py-12">No products found in this category.</p>
      ) : (
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id}
                className="glass-card p-4 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(177,243,16,0.15)] group relative flex flex-col justify-between"
              >
                <div>
                  {/* Product Image and overlays */}
                  <div className="relative aspect-[3/4] bg-white/5 rounded-[var(--radius-img)] overflow-hidden mb-6 flex items-center justify-center">
                    <Link href={`/product/${product.id}`} className="absolute inset-0 w-full h-full block z-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </Link>
                    {product.tag && (
                      <span className="absolute top-4 left-4 bg-brand-green text-brand-black text-xs font-bold px-3 py-1 uppercase tracking-widest z-10 pointer-events-none">
                        {product.tag}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 pointer-events-none">
                      <Link 
                        href={`/product/${product.id}`}
                        className="bg-brand-white text-brand-black font-bold uppercase tracking-widest px-6 py-3 rounded-[var(--radius-btn)] hover:bg-brand-green transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 text-xs text-center pointer-events-auto"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Title & Category Info */}
                  <div className="px-2">
                    <Link href={`/product/${product.id}`} className="block">
                      <h3 className="font-bold text-lg hover:text-brand-green transition-colors uppercase font-heading truncate">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                </div>

                <div className="px-2 mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-gray-400 text-xs font-mono uppercase">
                    {product.category}
                  </span>
                  <span className="text-brand-green font-bold tracking-widest">
                    ${product.price}.00
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
