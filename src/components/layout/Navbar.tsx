import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, Menu, User } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Left Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/men" className="text-sm font-semibold tracking-widest hover:text-brand-green transition-colors uppercase">Men</Link>
                    <Link href="/women" className="text-sm font-semibold tracking-widest hover:text-brand-green transition-colors uppercase">Women</Link>
                    <Link href="/accessories" className="text-sm font-semibold tracking-widest hover:text-brand-green transition-colors uppercase">Accessories</Link>
                </div>

                {/* Center Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center h-full max-h-24 pt-2 md:pt-4">
                    <Link href="/" className="relative h-12 w-[180px] sm:h-16 sm:w-[240px] md:h-28 md:w-[450px] flex items-center justify-center">
                        <Image
                            src="/LOGOO.png"
                            alt="Yubby Dubby Logo"
                            fill
                            className="object-contain scale-[1.2]"
                            priority
                        />
                    </Link>
                </div>

                {/* Right Icons */}
                <div className="flex items-center space-x-6">
                    <button className="hover:text-brand-green transition-colors">
                        <Search size={22} />
                    </button>
                    <button className="hover:text-brand-green transition-colors">
                        <User size={22} />
                    </button>
                    <button className="relative hover:text-brand-green transition-colors">
                        <ShoppingCart size={22} />
                        <span className="absolute -top-2 -right-2 bg-brand-green text-brand-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            0
                        </span>
                    </button>
                    <button className="md:hidden hover:text-brand-green transition-colors">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
