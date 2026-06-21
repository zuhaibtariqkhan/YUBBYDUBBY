"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, User, X, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "./CartDrawer";

const navLinks = [
    { name: "Shop", mobileName: "Shop", href: "/shop" },
    { name: "Yubby Dubby X Adidas", mobileName: "Yubby Dubby X Adidas", href: "/yubbydubby-x-adidas" },
    { name: "Create", mobileName: "Create Your Own", href: "/create-your-own" },
    { name: "About", mobileName: "About Us", href: "/about" },
];

const hamburgerLineVariants: any = {
    top: {
        closed: { rotate: 0, y: -6, backgroundColor: "#FFFFFF" },
        open: { rotate: 45, y: 0, backgroundColor: "#B1F310" },
    },
    middle: {
        closed: { opacity: 1, scale: 1, backgroundColor: "#FFFFFF" },
        open: { opacity: 0, scale: 0 },
    },
    bottom: {
        closed: { rotate: 0, y: 6, backgroundColor: "#FFFFFF" },
        open: { rotate: -45, y: 0, backgroundColor: "#B1F310" },
    }
};

const menuContainerVariants: any = {
    closed: {
        opacity: 0,
        y: 15,
        scale: 0.95,
        transition: {
            duration: 0.25,
            ease: [0.16, 1, 0.3, 1], // easeOutExpo
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    },
    open: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 280,
            damping: 26,
            staggerChildren: 0.08,
            delayChildren: 0.05
        }
    }
};

const menuItemVariants: any = {
    closed: { opacity: 0, y: 10, x: -5 },
    open: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 22
        }
    }
};

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

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

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
                        <motion.button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 1.08 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl cursor-pointer group focus:outline-none relative z-[70] mr-3 sm:mr-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:border-brand-green/35 hover:shadow-[0_0_18px_rgba(177,243,16,0.22)] transition-shadow duration-300"
                            aria-label="Toggle Menu"
                        >
                            <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                                <motion.span 
                                    variants={hamburgerLineVariants.top}
                                    animate={isMobileMenuOpen ? "open" : "closed"}
                                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                                    className="w-5 h-0.5 bg-white absolute" 
                                />
                                <motion.span 
                                    variants={hamburgerLineVariants.middle}
                                    animate={isMobileMenuOpen ? "open" : "closed"}
                                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                                    className="w-5 h-0.5 bg-white absolute" 
                                />
                                <motion.span 
                                    variants={hamburgerLineVariants.bottom}
                                    animate={isMobileMenuOpen ? "open" : "closed"}
                                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                                    className="w-5 h-0.5 bg-white absolute" 
                                />
                            </div>
                        </motion.button>
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
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            variants={menuContainerVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="absolute top-[88px] left-4 right-4 bg-black/95 backdrop-blur-3xl border border-white/10 p-6 rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(177,243,16,0.04)] md:hidden flex flex-col space-y-4 overflow-hidden"
                        >
                            {/* Inject keyframes for premium organic animated grain */}
                            <style dangerouslySetInnerHTML={{ __html: `
                                @keyframes noise-grain {
                                    0%, 100% { transform: translate(0, 0); }
                                    10% { transform: translate(-1%, -1%); }
                                    20% { transform: translate(-2%, 1%); }
                                    30% { transform: translate(1%, -2%); }
                                    40% { transform: translate(-1%, 2%); }
                                    50% { transform: translate(-2%, 1%); }
                                    60% { transform: translate(2%, 0); }
                                    70% { transform: translate(1%, 1%); }
                                    80% { transform: translate(1%, -2%); }
                                    90% { transform: translate(-1%, 2%); }
                                }
                                .noise-grain-animate {
                                    animation: noise-grain 0.6s steps(6) infinite;
                                }
                            ` }} />

                            {/* Subtle animated grain texture overlay */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.045] mix-blend-overlay rounded-[24px] overflow-hidden z-0">
                                <div 
                                    className="absolute -inset-[50%] w-[200%] h-[200%] noise-grain-animate"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'repeat',
                                    }}
                                />
                            </div>

                            {/* Floating Ambient Glow Orb */}
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.12, 1],
                                    opacity: [0.35, 0.5, 0.35],
                                    x: [-8, 8, -8],
                                    y: [-8, 8, -8]
                                }}
                                transition={{ 
                                    duration: 8, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] pointer-events-none z-0 blur-[60px]"
                                style={{
                                    background: 'radial-gradient(circle, rgba(177, 243, 16, 0.07) 0%, rgba(177, 243, 16, 0) 70%)'
                                }}
                            />

                            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-brand-green font-bold border-b border-white/5 pb-2 relative z-10">
                                Navigation Shortcuts
                            </span>
                            
                            <div className="flex flex-col space-y-3 relative z-10">
                                {navLinks.map((link) => {
                                    const active = isLinkActive(link.href);
                                    return (
                                        <motion.div
                                            key={link.href}
                                            variants={menuItemVariants}
                                            className="w-full"
                                        >
                                            <Link
                                                href={link.href}
                                                prefetch={false}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center justify-between py-3.5 px-5 rounded-xl transition-all duration-300 relative overflow-hidden border group ${
                                                    active 
                                                        ? "bg-white/[0.08] border-brand-green/35 text-brand-green font-bold shadow-[0_0_15px_rgba(177,243,16,0.08)] backdrop-blur-md" 
                                                        : "bg-transparent border-white/0 hover:border-white/5 hover:bg-white/[0.03] text-white/70 hover:text-white"
                                                }`}
                                            >
                                                {/* Tap Glow Overlay */}
                                                <motion.span
                                                    className="absolute inset-0 bg-brand-green/10 opacity-0 pointer-events-none rounded-xl"
                                                    whileTap={{ opacity: 1, scale: 1.02 }}
                                                    transition={{ duration: 0.15 }}
                                                />

                                                {/* Neon green left accent line indicator */}
                                                {active && (
                                                    <motion.span 
                                                        layoutId="activeIndicator"
                                                        className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r bg-brand-green shadow-[0_0_8px_#B1F310]" 
                                                    />
                                                )}

                                                {/* Background hover gradient glow */}
                                                <span className="absolute inset-0 bg-gradient-to-r from-brand-green/0 via-brand-green/[0.02] to-brand-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                
                                                <span className="text-sm font-heading tracking-wider uppercase relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                                                    {link.mobileName}
                                                </span>
                                                <ChevronRight size={14} className="text-gray-500 group-hover:text-brand-green group-hover:translate-x-1.5 transition-all duration-300 relative z-10" />
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
