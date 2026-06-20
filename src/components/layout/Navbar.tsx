"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, User, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
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
                                className="object-contain scale-100"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 relative z-20">
                        <button className="hover:text-brand-green transition-colors">
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

            {/* Cart Drawer Panel */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
