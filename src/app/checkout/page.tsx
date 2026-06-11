"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import Image from "next/image";
import { ArrowLeft, CreditCard, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Avoid hydration mismatch by waiting until client mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "US",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billing: formData,
          shipping: formData, // For simplicity, shipping matches billing
          cartItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      console.log("Order created:", data);

      // Clear the local cart before redirecting
      clearCart();

      // Redirect user to the secure WooCommerce Order Pay page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Redirection URL is missing.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please check your inputs.");
      setIsSubmitting(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-brand-green font-mono uppercase tracking-widest text-xs animate-pulse">
          INITIALIZING SECURE GATEWAY...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-between overflow-x-hidden font-sans">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 z-10 relative">
        {/* Header Breadcrumbs */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-brand-green transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
          <div className="text-[10px] text-gray-500 font-mono tracking-wider uppercase bg-white/5 px-3 py-1 rounded border border-white/5">
            🔒 SECURED SSL CHECKOUT
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="glass-card max-w-md mx-auto p-10 border border-white/10 rounded-[var(--radius-card)] text-center space-y-6 bg-white/[0.01]">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
              <ShoppingBag size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-black text-2xl uppercase tracking-wider text-white">
                No active session
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[240px] mx-auto font-sans">
                You cannot access checkout without items in your shopping bag.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-[var(--radius-btn)] hover:bg-white hover:shadow-[0_0_15px_rgba(177,243,16,0.3)] transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
              <div className="glass-card p-6 sm:p-8 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.01] space-y-6">
                <h2 className="font-heading font-black text-2xl uppercase tracking-widest text-white border-b border-white/10 pb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-green" />
                  Billing Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="ENTER FIRST NAME"
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="ENTER LAST NAME"
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ENTER EMAIL ADDRESS"
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="ENTER PHONE NUMBER"
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address1"
                    required
                    value={formData.address1}
                    onChange={handleChange}
                    placeholder="HOUSE NUMBER AND STREET NAME"
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all mb-3"
                  />
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    placeholder="APARTMENT, SUITE, UNIT, ETC. (OPTIONAL)"
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      Town / City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="CITY"
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      State / County *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="STATE"
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                    />
                  </div>

                  {/* Postcode */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      Postcode / ZIP *
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      required
                      value={formData.postcode}
                      onChange={handleChange}
                      placeholder="POSTCODE"
                      className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all text-white"
                  >
                    <option value="US" className="bg-[#090909] text-white">United States (US)</option>
                    <option value="CA" className="bg-[#090909] text-white">Canada (CA)</option>
                    <option value="GB" className="bg-[#090909] text-white">United Kingdom (GB)</option>
                    <option value="AU" className="bg-[#090909] text-white">Australia (AU)</option>
                    <option value="IN" className="bg-[#090909] text-white">India (IN)</option>
                  </select>
                </div>
              </div>

              {/* Checkout Terms and Error */}
              <div className="space-y-4">
                <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                  By placing your order, you agree to our terms of service and shipping policies. Your personal data is used to process your order, support your experience throughout this website, and for security metrics.
                </p>

                {errorMsg && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded font-mono uppercase tracking-wider">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 uppercase tracking-widest font-heading font-black text-sm rounded-[var(--radius-btn)] transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "bg-brand-green/20 text-brand-green border border-brand-green/30 cursor-not-allowed"
                      : "bg-brand-green text-brand-black hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.4)]"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">REDIRECTING TO SECURE PAYMENT PORTAL...</span>
                  ) : (
                    <span>PLACE ORDER & PAY</span>
                  )}
                </button>
              </div>
            </form>

            {/* Cart Summary Section */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-6 sm:p-8 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.01] space-y-6">
                <h2 className="font-heading font-black text-2xl uppercase tracking-widest text-white border-b border-white/10 pb-4">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 divide-y divide-white/5 max-h-[300px] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex gap-4 items-center pt-4 first:pt-0"
                    >
                      <div className="relative aspect-square w-14 rounded-[var(--radius-img)] overflow-hidden border border-white/10 shrink-0 bg-white/5 flex items-center justify-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold uppercase tracking-tight text-white truncate text-xs">
                          {item.name}
                        </h4>
                        <div className="text-[10px] text-gray-500 font-mono tracking-wider mt-0.5 uppercase">
                          QTY: {item.quantity} | Size: {item.size}
                        </div>
                      </div>
                      <div className="font-heading font-black text-brand-green tracking-widest text-xs">
                        ${item.price * item.quantity}.00
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-white/10" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="uppercase tracking-widest">Subtotal</span>
                    <span className="font-mono">${cartTotal}.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="uppercase tracking-widest">Shipping</span>
                    <span className="font-mono text-brand-green uppercase font-bold tracking-wider">
                      FREE DELIVERY
                    </span>
                  </div>
                  <hr className="border-white/5" />
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-white">
                      Grand Total
                    </span>
                    <span className="font-heading font-black text-xl text-brand-green tracking-wider">
                      ${cartTotal}.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Secure Trust indicators */}
              <div className="glass-card p-6 rounded-[var(--radius-card)] border border-white/5 bg-white/[0.005] space-y-4">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <ShieldCheck size={20} className="text-brand-green shrink-0" />
                  <div>
                    <span className="font-bold text-white block uppercase tracking-wider text-[10px]">
                      Authentic WooCommerce API Link
                    </span>
                    Direct token handshake encryption ensures details are processed securely.
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <Truck size={20} className="text-brand-green shrink-0" />
                  <div>
                    <span className="font-bold text-white block uppercase tracking-wider text-[10px]">
                      Global Printful Fulfillment
                    </span>
                    Orders automatically sync with global print-on-demand pipelines.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
