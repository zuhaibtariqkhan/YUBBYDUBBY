"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { CartItem } from "@/context/CartContext";
import { CURRENCY_SYMBOL } from "@/lib/utils";

interface CartToastProps {
  item: CartItem | null;
  onClose: () => void;
  onOpenDrawer: () => void;
}

export default function CartToast({ item, onClose, onOpenDrawer }: CartToastProps) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key={`${item.id}-${item.size}-${item.color || ""}-${Date.now()}`}
          initial={{ opacity: 0, y: -30, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-20 right-4 sm:right-6 z-[9999] max-w-sm w-full bg-[#090909]/95 backdrop-blur-2xl border border-brand-green/40 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(177,243,16,0.25)] rounded-[18px] p-4 text-white overflow-hidden"
        >
          {/* Top animated glowing accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-green to-transparent" />

          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-brand-green/20 border border-brand-green flex items-center justify-center text-brand-green shadow-[0_0_8px_rgba(177,243,16,0.4)]">
                <Check size={12} strokeWidth={3} />
              </div>
              <span className="font-heading font-black text-xs uppercase tracking-widest text-brand-green">
                Added To Cart
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex gap-3.5 items-center">
            {/* Product Thumbnail */}
            <div className="relative aspect-square w-14 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-neutral-900 flex items-center justify-center">
              <Image
                src={item.image || "/prod-hoodie.png"}
                alt={item.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs uppercase truncate text-white tracking-wide">
                {item.name}
              </h4>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                Size: <span className="text-white font-bold">{item.size}</span>
                {item.color && (
                  <span className="ml-2">Color: <span className="text-white font-bold">{item.color}</span></span>
                )}
              </div>
              <div className="font-heading font-black text-brand-green text-xs mt-1 tracking-wider">
                {CURRENCY_SYMBOL}{item.price.toFixed(2)} x {item.quantity}
              </div>
            </div>

            {/* View Cart Button */}
            <button
              onClick={() => {
                onClose();
                onOpenDrawer();
              }}
              className="bg-brand-green text-brand-black font-bold uppercase text-[10px] tracking-widest px-3 py-2 rounded-md hover:bg-white transition-all shrink-0 flex items-center gap-1.5 shadow-[0_0_12px_rgba(177,243,16,0.35)] cursor-pointer"
            >
              <ShoppingBag size={12} />
              View
            </button>
          </div>

          {/* Animated Progress line */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3.5, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-green origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
