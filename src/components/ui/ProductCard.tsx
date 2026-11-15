"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { CURRENCY_SYMBOL } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  regularPrice?: number;
  image: string;
  tag?: string;
  category?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  regularPrice,
  image,
  tag,
  category,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [imgSrc, setImgSrc] = useState<string>(image || "/prod-hoodie.png");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setImgSrc(image || "/prod-hoodie.png");
  }, [image]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    addToCart({
      id,
      name,
      price,
      size: "M",
      image: imgSrc
    }, 1);

    setTimeout(() => setIsAdding(false), 1200);
  };

  const isOnSale = regularPrice && regularPrice > price;

  return (
    <div className="group flex flex-col w-full bg-transparent border-0 p-0 text-current transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] w-full bg-neutral-900 rounded-[var(--radius-img)] overflow-hidden flex items-center justify-center">
        <Link href={`/product/${id}`} className="absolute inset-0 w-full h-full block z-0">
          <Image
            src={imgSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            priority={false}
            onError={() => {
              if (imgSrc !== "/prod-hoodie.png") {
                setImgSrc("/prod-hoodie.png");
              }
            }}
          />
        </Link>

        {/* Subtle top-left status badge */}
        {tag && (
          <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-brand-black/90 backdrop-blur-md text-brand-white text-[8px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest border border-white/10 z-10 pointer-events-none rounded-sm">
            {tag}
          </span>
        )}

        {/* Floating animated success ring overlay on add */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-brand-black/40 backdrop-blur-[2px]"
            >
              <div className="w-16 h-16 rounded-full bg-brand-green/20 border-2 border-brand-green flex items-center justify-center text-brand-green shadow-[0_0_30px_#B1F310]">
                <Check size={28} strokeWidth={3} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Quick Add bar on desktop hover */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <motion.button
            onClick={handleQuickAdd}
            animate={isAdding ? { scale: [1, 1.04, 1], backgroundColor: "#B1F310", color: "#000000" } : {}}
            transition={{ duration: 0.3 }}
            className="w-full bg-brand-black text-brand-white hover:bg-brand-green hover:text-brand-black py-3 text-2xs font-mono font-bold uppercase tracking-widest transition-colors duration-200 shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isAdding ? (
              <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                <Check size={14} strokeWidth={3} /> Added to Cart!
              </motion.span>
            ) : (
              "Quick Add +"
            )}
          </motion.button>
        </div>
        
        {/* Mobile Quick Add icon button */}
        <motion.button
          onClick={handleQuickAdd}
          animate={isAdding ? { scale: [1, 1.3, 1], backgroundColor: "#B1F310", color: "#000000" } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className="md:hidden absolute bottom-2.5 right-2.5 z-10 min-w-[40px] min-h-[40px] w-10 h-10 rounded-full bg-brand-black/85 backdrop-blur-md text-brand-white hover:bg-brand-green hover:text-brand-black flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
          aria-label="Quick add to cart"
        >
          {isAdding ? <Check size={16} strokeWidth={3} /> : <Plus size={15} />}
        </motion.button>
      </div>

      {/* Product Information Details */}
      <div className="flex flex-col mt-3.5 space-y-1">
        {/* Category Label (Subtle) */}
        {category && (
          <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">
            {category}
          </span>
        )}

        {/* Product Title */}
        <Link href={`/product/${id}`} className="block group-hover:text-brand-green transition-colors">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wide line-clamp-2 leading-snug">
            {name}
          </h3>
        </Link>

        {/* Pricing Layout */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-bold text-xs md:text-sm font-sans tracking-wide text-brand-green">
            {CURRENCY_SYMBOL}{price.toFixed(2)}
          </span>
          {isOnSale && (
            <span className="text-2xs text-gray-500 line-through font-sans">
              {CURRENCY_SYMBOL}{regularPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
