"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  tag: string;
  subcategory: string;
}

interface ShopSectionProps {
  id: string;
  title: string;
  products: ShopProduct[];
}

export default function ShopSection({ id, title, products }: ShopSectionProps) {
  const [activeSub, setActiveSub] = useState("All");

  // Dynamically extract unique subcategories from the products list
  const subcategories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.subcategory).filter(Boolean))),
  ];

  // Filter products based on subcategory selection
  const filteredProducts =
    activeSub === "All"
      ? products
      : products.filter((p) => p.subcategory === activeSub);

  return (
    <section id={id} className="border-t border-white/10 pt-10">
      {/* Header & Subcategory Tabs wrapper */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-heading uppercase tracking-widest border-b border-white/5 pb-2 min-w-[200px]">
          {title}
        </h2>

        {/* Subcategories Filter Tabs */}
        {subcategories.length > 1 && (
          <div className="flex flex-wrap gap-2 bg-white/5 border border-white/5 p-1 rounded-2xl md:rounded-full text-xs font-mono w-full md:w-auto">
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSub(sub)}
                className={`relative px-4 py-2 rounded-full cursor-pointer transition-colors duration-300 uppercase tracking-widest text-[10px] font-bold ${
                  activeSub === sub ? "text-brand-black" : "text-gray-400 hover:text-white"
                }`}
              >
                {activeSub === sub && (
                  <motion.div
                    layoutId={`activeSub-${id}`}
                    className="absolute inset-0 bg-brand-green rounded-full z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  />
                )}
                <span className="relative z-10">{sub}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No products found in this category.</p>
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
                  
                  <div className="px-2">
                    <Link href={`/product/${product.id}`} className="block">
                      <h3 className="font-bold text-lg hover:text-brand-green transition-colors uppercase font-heading truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-2 text-brand-green font-bold tracking-widest">
                      ${product.price}.00
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
