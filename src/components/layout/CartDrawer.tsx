"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#090909] border-l border-white/10 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0d0d0d]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-green" />
                <h2 className="font-heading font-black text-xl uppercase tracking-widest text-white">
                  Shopping Bag
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-brand-green transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 border border-white/10">
                    <ShoppingBag size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                      Your bag is empty
                    </h3>
                    <p className="text-gray-500 text-xs max-w-[200px] mx-auto font-sans leading-relaxed">
                      Looks like you haven&apos;t added any streetwear structures to your collection yet.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-brand-green text-brand-black text-xs font-bold uppercase tracking-widest rounded-[var(--radius-btn)] hover:bg-white hover:shadow-[0_0_15px_rgba(177,243,16,0.3)] transition-all cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      layout
                      key={`${item.id}-${item.size}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="glass-card p-4 rounded-[var(--radius-card)] border border-white/5 flex gap-4 items-center bg-white/[0.01]"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square w-20 rounded-[var(--radius-img)] overflow-hidden border border-white/10 shrink-0 bg-white/5 flex items-center justify-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-heading font-bold uppercase tracking-tight text-white truncate text-sm hover:text-brand-green transition-colors pr-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-gray-600 hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Size */}
                        <div className="text-[10px] text-gray-500 font-mono tracking-wider uppercase mt-0.5">
                          Size: <span className="text-white font-bold">{item.size}</span>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center border border-white/10 rounded-[var(--radius-dropdown)] bg-white/5 h-8">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="px-2 text-gray-400 hover:text-white transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center font-bold text-xs text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="px-2 text-gray-400 hover:text-white transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div className="font-heading font-black text-brand-green tracking-widest text-sm">
                            ${item.price * item.quantity}.00
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#0d0d0d] space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Subtotal
                  </span>
                  <span className="font-heading font-black text-2xl text-brand-green tracking-wider">
                    ${cartTotal}.00
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-sans leading-normal">
                  Shipping, taxes, and discounts calculated securely at order payment checkout.
                </p>
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full h-12 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-[var(--radius-btn)] hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.4)] transition-all flex items-center justify-center"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={onClose}
                    className="w-full h-12 bg-transparent border border-white/10 text-white font-heading font-black uppercase tracking-widest text-xs rounded-[var(--radius-btn)] hover:border-white transition-all cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
