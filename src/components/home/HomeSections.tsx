"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Lock, ArrowRight, Instagram, Mail } from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaGooglePay, FaApplePay } from "react-icons/fa";
import { SiPaytm, SiPhonepe } from "react-icons/si";
import { MdOutlinePayment } from "react-icons/md";

export function LimitedDrop() {
    return (
        <section className="bg-brand-white text-brand-black py-20 px-6 mt-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2">
                    <span className="text-brand-green font-bold tracking-widest uppercase text-sm mb-4 block">Print On Demand</span>
                    <h2 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                        Create Your<br />Own
                    </h2>
                    <p className="mt-6 text-gray-600 max-w-md font-sans">
                        Upload your design, choose your product, and we craft it with premium precision.
                    </p>
                    <button className="mt-8 bg-brand-black text-brand-white font-bold uppercase tracking-widest px-10 py-4 rounded-[var(--radius-btn)] hover:bg-brand-green hover:text-black transition-all duration-300">
                        Create Now
                    </button>
                </div>
                <div className="md:w-1/2 relative min-h-[400px] w-full bg-gray-200 rounded-[var(--radius-card)] overflow-hidden flex items-center justify-center">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Capsule Image</span>
                </div>
            </div>
        </section>
    );
}

export function EditorialMessage() {
    return (
        <section className="relative text-brand-white py-40 px-6 flex items-center justify-center text-center overflow-hidden min-h-[60vh]">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/UPDATED YUBBYDUBBYSTUDIO.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-black/60 z-10"></div>

            <div className="relative z-20 max-w-4xl mx-auto px-4 md:px-8">
                <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl uppercase tracking-widest leading-relaxed drop-shadow-lg">
                    "We do not follow trends. We dictate the aesthetic of tomorrow's urban landscape."
                </h2>
                <p className="mt-8 md:mt-12 text-brand-green font-bold tracking-widest uppercase text-sm md:text-base drop-shadow-md">
                    - YUBBY DUBBY STUDIO
                </p>
            </div>
        </section>
    );
}

export function TrustStrip() {
    return (
        <section className="border-y border-white/10 bg-brand-black py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-brand-white">
                <div className="flex flex-col items-center justify-center">
                    <Truck size={32} className="text-brand-green mb-4" />
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Global Shipping</h4>
                    <p className="text-gray-400 text-sm max-w-[200px]">Free worldwide delivery.</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <ShieldCheck size={32} className="text-brand-green mb-4" />
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Premium Quality</h4>
                    <p className="text-gray-400 text-sm max-w-[200px]">Engineered with absolute precision.</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Lock size={32} className="text-brand-green mb-4" />
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-2">Secure Payments</h4>
                    <p className="text-gray-400 text-sm max-w-[200px]">Encrypted, protected, and fully secure transactions.</p>
                </div>
            </div>
        </section>
    );
}

export function Footer() {
    return (
        <footer className="bg-brand-black text-brand-white pt-16 md:pt-24 pb-8 md:pb-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 border-b border-white/10 pb-10 md:pb-16">

                {/* Brand / Newsletter */}
                <div className="md:col-span-2">
                    <h3 className="font-heading text-3xl md:text-4xl font-bold tracking-widest uppercase mb-4 md:mb-6">Yubby Dubby</h3>
                    <p className="text-gray-400 max-w-sm mb-6 md:mb-8 text-sm md:text-base">
                        Join the collective. Gain early access to limited drops and exclusive studio content.
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="ENTER EMAIL"
                            className="bg-transparent border border-white/20 px-6 py-4 outline-none focus:border-brand-green transition-colors flex-grow uppercase text-sm tracking-widest"
                        />
                        <button className="bg-brand-white text-brand-black px-6 hover:bg-brand-green transition-colors flex items-center justify-center">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-bold uppercase tracking-widest mb-4 md:mb-6 text-sm text-brand-green">Shop</h4>
                    <ul className="space-y-4 text-gray-400 text-sm uppercase tracking-wider">
                        <li><a href="#" className="hover:text-white transition-colors">Men</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Women</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Kids</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Home & Living</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="mt-4 md:mt-0">
                    <h4 className="font-bold uppercase tracking-widest mb-4 md:mb-6 text-sm text-brand-green">Contact</h4>
                    <ul className="space-y-4 text-gray-400 text-sm tracking-wider">
                        <li className="uppercase leading-relaxed">
                            Yubby Dubby Pvt. Ltd.<br />
                            5th Floor, Tower B, ITPL<br />
                            Bengaluru, Karnataka 560066, India
                        </li>
                        <li className="flex items-center gap-6 mt-6">
                            <a href="mailto:ask@yubbydubby.com" className="hover:text-white transition-colors flex items-center gap-2">
                                <Mail size={18} />
                                <span className="lowercase">ask@yubbydubby.com</span>
                            </a>
                            <a href="https://www.instagram.com/yubby.dubby/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-brand-green" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto mt-8 md:mt-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-xs text-gray-500 tracking-widest uppercase gap-6 md:gap-0">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    © 2022-{new Date().getFullYear()} YUBBY DUBBY. {" "}
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        ALL RIGHTS RESERVED
                    </motion.span>
                    <span className="hidden md:inline">{" | "}</span>
                    <br className="md:hidden" />
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-brand-green font-bold block md:inline mt-2 md:mt-0"
                    >
                        DEVELOPED BY ZTK
                    </motion.span>
                    <span className="hidden md:inline">{" |"}</span>
                </motion.p>
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-6 md:mt-0">
                    <div className="flex gap-4 md:gap-6 mb-4 md:mb-0 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-white/10 md:pr-6">
                        <a href="#" className="hover:text-brand-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-brand-white transition-colors">Terms</a>
                    </div>
                    {/* Payment Icons */}
                    <div className="flex items-center gap-4 text-xl text-gray-400">
                        <FaCcVisa className="hover:text-white transition-colors" title="Visa" />
                        <FaCcMastercard className="hover:text-white transition-colors" title="Mastercard" />
                        <SiPaytm className="hover:text-white transition-colors" title="Paytm" />
                        <FaGooglePay className="hover:text-white transition-colors text-2xl" title="Google Pay" />
                        <FaApplePay className="hover:text-white transition-colors text-2xl" title="Apple Pay" />
                        <SiPhonepe className="hover:text-white transition-colors" title="PhonePe" />
                        <MdOutlinePayment className="hover:text-white transition-colors text-2xl" title="UPI & Other Options" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
