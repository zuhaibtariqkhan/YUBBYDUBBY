"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import CartToast from "@/components/ui/CartToast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color?: string;
  image: string;
  toastId?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (id: string, size: string, color?: string) => void;
  updateQuantity: (id: string, size: string, color: string | undefined, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCartBouncing: boolean;
  toastItem: CartItem | null;
  clearToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [toastItem, setToastItem] = useState<CartItem | null>(null);

  // Load cart from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    const savedCart = localStorage.getItem("yubby_dubby_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse saved cart:", error);
      }
    }
    setIsMounted(true);
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("yubby_dubby_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (newItem: Omit<CartItem, "quantity">, quantity: number) => {
    const stableToastId = `${newItem.id}-${newItem.size}-${newItem.color || ""}-${Date.now()}`;
    const fullItem: CartItem = { ...newItem, quantity, toastId: stableToastId };

    // Trigger toast notification with stable identifier
    setToastItem(fullItem);

    // Trigger navbar cart icon animation bounce
    setIsCartBouncing(true);
    setTimeout(() => setIsCartBouncing(false), 800);

    setCartItems((prevItems) => {
      // Check if product with same ID, same size, and same color already exists
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
      );

      if (existingItemIndex > -1) {
        // Increase quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      }

      // Add as new item
      return [...prevItems, fullItem];
    });
  };

  // Auto clear toast after 3.5 seconds
  useEffect(() => {
    if (toastItem) {
      const timer = setTimeout(() => {
        setToastItem(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastItem]);

  const clearToast = () => setToastItem(null);

  const removeFromCart = (id: string, size: string, color?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.size === size && item.color === color))
    );
  };

  const updateQuantity = (id: string, size: string, color: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.size === size && item.color === color ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Helper calculations
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isCartBouncing,
        toastItem,
        clearToast,
      }}
    >
      {children}
      <CartToast
        item={toastItem}
        onClose={clearToast}
        onOpenDrawer={() => setIsCartOpen(true)}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
