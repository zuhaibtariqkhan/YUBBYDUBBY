"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { CURRENCY_SYMBOL } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  regularPrice?: number;
  image: string;
  tag?: string;
  category?: string;
  rating?: {
    score: number;
    count: number;
  };
}

export default function ProductCard({
  id,
  name,
  price,
  regularPrice,
  image,
  tag,
  category,
  rating = { score: 4.8, count: 98 }
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      name,
      price,
      size: "M",
      image
    }, 1);
  };

  const isOnSale = regularPrice && regularPrice > price;

  return (
    <div className="group flex flex-col w-full bg-transparent border-0 p-0 text-current transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] w-full bg-neutral-900 rounded-[var(--radius-img)] overflow-hidden flex items-center justify-center">
        <Link href={`/product/${id}`} className="absolute inset-0 w-full h-full block z-0">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            priority={false}
          />
        </Link>

        {/* Subtle top-left status badge */}
        {tag && (
          <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-brand-black/90 backdrop-blur-md text-brand-white text-[8px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest border border-white/10 z-10 pointer-events-none rounded-sm">
            {tag}
          </span>
        )}

        {/* Premium Quick Add bar on desktop hover */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-brand-black text-brand-white hover:bg-brand-green hover:text-brand-black py-3 text-2xs font-mono font-bold uppercase tracking-widest transition-colors duration-200 shadow-lg cursor-pointer"
          >
            Quick Add +
          </button>
        </div>
        
        {/* Mobile Quick Add icon button (44px touch target) */}
        <button
          onClick={handleQuickAdd}
          className="md:hidden absolute bottom-2.5 right-2.5 z-10 min-w-[40px] min-h-[40px] w-10 h-10 rounded-full bg-brand-black/85 backdrop-blur-md text-brand-white hover:bg-brand-green hover:text-brand-black flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
          aria-label="Quick add to cart"
        >
          <Plus size={15} />
        </button>
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
          <span className="font-bold text-xs md:text-sm font-sans tracking-wide">
            {CURRENCY_SYMBOL}{price.toFixed(2)}
          </span>
          {isOnSale && (
            <span className="text-2xs text-gray-500 line-through font-sans">
              {CURRENCY_SYMBOL}{regularPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating Row (Subtle) */}
        {rating && (
          <div className="flex items-center gap-1 mt-0.5 text-2xs text-gray-500 font-mono">
            <Star size={9} className="fill-brand-green text-brand-green" />
            <span>{rating.score.toFixed(1)}</span>
            <span className="text-[10px] text-gray-600">({rating.count})</span>
          </div>
        )}
      </div>
    </div>
  );
}
