"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, User, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "./CartDrawer";

const navLinks = [
    { name: "Shop", mobileName: "Shop", href: "/shop" },
    { name: "Yubby Dubby X Adidas", mobileName: "Yubby Dubby X Adidas", href: "/yubbydubby-x-adidas" },
    { name: "Create", mobileName: "Create Your Own", href: "/create-your-own" },
    { name: "About", mobileName: "About Us", href: "/about" },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cartCount } = useCart();
    const pathname = usePathname();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            fetch(`/api/shop/products?search=${encodeURIComponent(searchQuery)}`)
                .then(res => res.json())
                .then(data => {
                    setSearchResults(data || []);
                })
                .catch(err => {
                    console.error("Search failed:", err);
                })
                .finally(() => {
                    setIsSearching(false);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (!isSearchOpen) return;
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsSearchOpen(false);
                setSearchQuery("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSearchOpen]);

    const isLinkActive = (href: string) => {
        if (href === "/") return pathname === "/";
        if (href === "/shop") {
            return pathname === "/shop" || pathname.startsWith("/shop/") || pathname.startsWith("/product/");
        }
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <>
            <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between relative">

                    {/* Left Section Navigation Links */}
                    <div className="flex items-center relative z-20">
                        <button
                            className="md:hidden hover:text-brand-green transition-colors mr-3 sm:mr-4"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map((link) => {
                                const active = isLinkActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        prefetch={false}
                                        className={`text-xs font-semibold tracking-widest transition-colors uppercase ${
                                            active ? "text-brand-green" : "text-white hover:text-brand-green"
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Center Logo */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center h-full max-h-20 pt-1 z-10 pointer-events-none">
                        <Link href="/" className="relative h-[80px] w-[200px] sm:h-[90px] sm:w-[250px] md:h-24 md:w-[320px] flex items-center justify-center pointer-events-auto">
                            <Image
                                src="/LOGOO.png"
                                alt="Yubby Dubby Logo"
                                fill
                                sizes="(max-width: 640px) 200px, (max-width: 768px) 250px, 320px"
                                className="object-contain scale-100"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 relative z-20">
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="hover:text-brand-green transition-colors cursor-pointer"
                        >
                            <Search className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                        </button>
                        <Link 
                            href="/account" 
                            className={`transition-colors cursor-pointer ${
                                pathname === "/account" ? "text-brand-green" : "text-white hover:text-brand-green"
                            }`}
                        >
                            <User className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                        </Link>
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="relative hover:text-brand-green transition-colors cursor-pointer"
                        >
                            <ShoppingCart className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-brand-green text-brand-black text-[10px] md:text-xs font-bold w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[60] bg-brand-black/95 backdrop-blur-md flex flex-col items-center justify-center md:hidden">
                        <button
                            className="absolute top-6 right-6 text-white hover:text-brand-green transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={32} />
                        </button>
                        <div className="flex flex-col items-center space-y-8 text-2xl font-oswald tracking-widest uppercase text-center px-4">
                            {navLinks.map((link) => {
                                const active = isLinkActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        prefetch={false}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`transition-colors ${
                                            active ? "text-brand-green" : "text-white hover:text-brand-green"
                                        }`}
                                    >
                                        {link.mobileName}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-brand-black/95 backdrop-blur-2xl flex flex-col justify-start pt-24 px-4 sm:px-6 md:px-8 overflow-y-auto selection:bg-brand-green selection:text-brand-black"
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-6 right-6 text-white hover:text-brand-green transition-colors cursor-pointer"
                            onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery("");
                            }}
                        >
                            <X size={32} />
                        </button>

                        <div className="w-full max-w-4xl mx-auto space-y-12 pb-16">
                            {/* Search Input Box */}
                            <div className="relative border-b border-white/20 pb-4">
                                <Search className="absolute left-0 bottom-6 w-8 h-8 text-brand-green" />
                                <input
                                    type="text"
                                    placeholder="SEARCH STREETWEAR..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="w-full pl-12 bg-transparent text-white text-2xl md:text-4xl lg:text-5xl font-heading font-black uppercase tracking-widest border-none outline-none placeholder:text-white/25 focus:ring-0 focus:outline-none"
                                />
                            </div>

                            {/* Search Results Display Area */}
                            <div className="space-y-6 min-h-[300px]">
                                {isSearching ? (
                                    <div className="flex items-center justify-center py-12 text-gray-500 font-mono text-sm tracking-wider uppercase">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping mr-2.5" />
                                        Scanning Database...
                                    </div>
                                ) : searchQuery.trim() === "" ? (
                                    <div className="text-center py-16 space-y-3">
                                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-green font-bold block">
                                            Popular Searches
                                        </span>
                                        <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto pt-2">
                                            {["Tee", "Hoodie", "Sweatshirt", "Jacket", "Case"].map((term) => (
                                                <button
                                                    key={term}
                                                    onClick={() => setSearchQuery(term)}
                                                    className="px-4 py-2 rounded-full border border-white/10 hover:border-brand-green bg-white/5 text-[10px] font-mono uppercase tracking-widest text-gray-300 hover:text-brand-green transition-all cursor-pointer"
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : searchResults.length === 0 ? (
                                    <div className="text-center py-16 text-gray-500 font-mono text-sm uppercase tracking-widest">
                                        No items matching "{searchQuery}" found.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-green font-bold block">
                                            Search Results ({searchResults.length})
                                        </span>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
                                            {searchResults.map((product) => (
                                                <motion.div
                                                    key={product.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="glass-card p-3 rounded-2xl border border-white/10 bg-white/[0.01] hover:border-brand-green/30 transition-all duration-300 flex flex-col justify-between group"
                                                >
                                                    <div className="relative aspect-square w-full rounded-xl bg-white/5 overflow-hidden mb-3 flex items-center justify-center">
                                                        <Link 
                                                            href={`/product/${product.id}`}
                                                            onClick={() => {
                                                                setIsSearchOpen(false);
                                                                setSearchQuery("");
                                                            }}
                                                            className="absolute inset-0 z-0"
                                                        >
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Link
                                                            href={`/product/${product.id}`}
                                                            onClick={() => {
                                                                setIsSearchOpen(false);
                                                                setSearchQuery("");
                                                            }}
                                                            className="block"
                                                        >
                                                            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white line-clamp-1 hover:text-brand-green transition-colors">
                                                                {product.name}
                                                            </h4>
                                                        </Link>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[9px] sm:text-[10px] font-mono text-brand-green font-bold">
                                                                ${product.price}.00
                                                            </span>
                                                            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider">
                                                                {product.subcategory || "STREETWEAR"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cart Drawer Panel */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
