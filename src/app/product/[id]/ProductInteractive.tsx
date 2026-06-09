"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Minus, Plus, ShoppingBag, Heart, Shield, RotateCcw, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductInteractiveProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    sizes: string[];
    inStock: boolean;
    rating: number;
    ratingCount: number;
    category?: string;
  };
}

export default function ProductInteractive({ product }: ProductInteractiveProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0] || "/prod-hoodie.png");
  const [isLiked, setIsLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left Column: Image Gallery */}
      <div className="lg:col-span-7 space-y-6">
        {/* Main Image Container */}
        <div className="glass-card aspect-[4/5] relative overflow-hidden rounded-[var(--radius-card)] border border-white/10 flex items-center justify-center bg-white/5">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-all duration-500"
          />
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative aspect-square w-20 rounded-[var(--radius-img)] overflow-hidden border bg-white/5 transition-colors ${
                  activeImage === img ? "border-brand-green" : "border-white/10"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${idx}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Product Info */}
      <div className="lg:col-span-5 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-widest uppercase text-brand-green font-bold">
                {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(product.rating)
                        ? "fill-brand-green text-brand-green"
                        : "text-white/20"
                    }
                  />
                ))}
                <span className="text-xs text-gray-400 ml-2">({product.ratingCount} reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter text-white">
              {product.name}
            </h1>
            <div className="text-3xl font-heading font-bold text-brand-green tracking-widest">
              ${product.price}.00
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Description */}
          <div 
            className="text-gray-400 font-sans text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <hr className="border-white/10" />

          {/* Sizes Selector */}
          {product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                Select Size: <span className="text-white ml-2">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[50px] h-10 flex items-center justify-center rounded-[var(--radius-dropdown)] border font-bold text-sm tracking-wider transition-colors ${
                      selectedSize === size
                        ? "bg-brand-green text-brand-black border-brand-green"
                        : "border-white/10 hover:border-white/40 text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">
              Quantity
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-white/10 rounded-[var(--radius-dropdown)] h-12 bg-white/5">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 text-gray-400 hover:text-white transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 text-gray-400 hover:text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`aspect-square h-12 flex items-center justify-center rounded-[var(--radius-dropdown)] border transition-colors ${
                  isLiked
                    ? "border-red-500 bg-red-500/10 text-red-500"
                    : "border-white/10 hover:border-white/40 text-white"
                }`}
              >
                <Heart size={20} className={isLiked ? "fill-red-500" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-6 mt-8">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-4 uppercase tracking-widest font-heading font-black text-sm rounded-[var(--radius-btn)] transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 ${
              addedToCart
                ? "bg-brand-green text-brand-black shadow-[0_0_20px_rgba(177,243,16,0.5)]"
                : "bg-white text-black hover:bg-brand-green hover:shadow-[0_0_20px_rgba(177,243,16,0.3)]"
            }`}
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span
                  key="added"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  Added to bag!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag size={16} />
                  Add to bag
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Key Value Propositions */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            <div className="flex flex-col items-center text-center space-y-2">
              <Truck size={18} className="text-brand-green" />
              <span>Free Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <RotateCcw size={18} className="text-brand-green" />
              <span>30 Day Returns</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <Shield size={18} className="text-brand-green" />
              <span>Secured Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
