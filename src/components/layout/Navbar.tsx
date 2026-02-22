"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Search, Menu, User, X } from "lucide-react";


export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">

                {/* Left Section */}
                <div className="flex items-center">
                    <button
                        className="md:hidden hover:text-brand-green transition-colors mr-3 sm:mr-4"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/men" className="text-sm font-semibold tracking-widest hover:text-brand-green transition-colors uppercase">Men</Link>
                        <Link href="/women" className="text-sm font-semibold tracking-widest hover:text-brand-green transition-colors uppercase">Women</Link>
                        <Link href="/accessories" className="text-sm font-semibold tracking-widest hover:text-brand-green transition-colors uppercase">Accessories</Link>
                        <Link href="/about" className="text-sm font-semibold tracking-widest hover:text-brand-green transition-colors uppercase">About Us</Link>
                    </div>
                </div>

                {/* Center Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center h-full max-h-24 pt-1 md:pt-1">
                    <Link href="/" className="relative h-[85px] w-[250px] sm:h-[100px] sm:w-[320px] md:h-32 md:w-[420px] flex items-center justify-center">
                        <Image
                            src="/LOGOO.png"
                            alt="Yubby Dubby Logo"
                            fill
                            className="object-contain scale-[1.05]"
                            priority
                        />
                    </Link>
                </div>

                {/* Right Icons */}
                <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
                    <button className="hover:text-brand-green transition-colors">
                        <Search className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                    </button>
                    <button className="hover:text-brand-green transition-colors">
                        <User className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                    </button>
                    <button className="relative hover:text-brand-green transition-colors">
                        <ShoppingCart className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                        <span className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-brand-green text-brand-black text-[10px] md:text-xs font-bold w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center">
                            0
                        </span>
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
                    <div className="flex flex-col items-center space-y-8 text-2xl font-oswald tracking-widest uppercase">
                        <Link href="/men" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-green transition-colors">Men</Link>
                        <Link href="/women" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-green transition-colors">Women</Link>
                        <Link href="/accessories" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-green transition-colors">Accessories</Link>
                        <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-green hover:text-white transition-colors">About Us</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
