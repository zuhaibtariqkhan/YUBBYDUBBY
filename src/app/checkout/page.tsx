"use client";

import { useState, useSyncExternalStore } from "react";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import Image from "next/image";
import {
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { CURRENCY_SYMBOL } from "@/lib/utils";
import { executeRazorpayCheckout } from "@/lib/razorpay-client";
import StateSelect from "@/components/checkout/StateSelect";
import CityAutocomplete from "@/components/checkout/CityAutocomplete";
import {
  isValidIndianPinCode,
  isValidIndianPhone,
  isValidIndianState,
  cleanIndianPhone,
} from "@/lib/india-locations";

const emptySubscribe = () => () => {};

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "woocommerce">("razorpay");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Client hydration detection without cascading re-renders
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Success state after Razorpay payment verification
  const [paymentSuccess, setPaymentSuccess] = useState<{
    paymentId: string;
    orderId: string;
    amount: number;
    customerEmail: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "Jammu and Kashmir",
    postcode: "",
    country: "IN",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear individual field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required.";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters.";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    const cleanedPhone = cleanIndianPhone(formData.phone);
    if (!formData.phone.trim()) {
      errors.phone = "Mobile phone number is required.";
    } else if (!isValidIndianPhone(cleanedPhone)) {
      errors.phone = "Enter a valid 10-digit Indian mobile number (e.g. 9876543210).";
    }

    if (!formData.address1.trim()) {
      errors.address1 = "Street address is required.";
    } else if (formData.address1.trim().length < 5) {
      errors.address1 = "Please enter complete street details (minimum 5 characters).";
    }

    if (!formData.state.trim()) {
      errors.state = "Please select your State or Union Territory.";
    } else if (!isValidIndianState(formData.state)) {
      errors.state = "Please select a valid Indian State from the dropdown.";
    }

    if (!formData.city.trim()) {
      errors.city = "Please select or enter your City / District.";
    } else if (formData.city.trim().length < 2) {
      errors.city = "City name must be at least 2 characters.";
    }

    const cleanPin = formData.postcode.trim();
    if (!cleanPin) {
      errors.postcode = "6-digit Indian PIN code is required.";
    } else if (!isValidIndianPinCode(cleanPin)) {
      errors.postcode = "Invalid PIN code. Must be 6 digits and cannot start with 0.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    // Run strict delivery validation
    const isValid = validateForm();
    if (!isValid) {
      setErrorMsg("Please correct the invalid delivery information before proceeding.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    const normalizedPhone = cleanIndianPhone(formData.phone);
    const normalizedFormData = {
      ...formData,
      phone: normalizedPhone,
      postcode: formData.postcode.trim(),
    };

    if (paymentMethod === "razorpay") {
      try {
        const amountInPaise = Math.max(100, Math.round(cartTotal * 100));

        await executeRazorpayCheckout({
          amount: amountInPaise,
          currency: "INR",
          description: `Order for ${cartItems.length} item(s)`,
          prefill: {
            name: `${normalizedFormData.firstName} ${normalizedFormData.lastName}`.trim(),
            email: normalizedFormData.email,
            contact: normalizedFormData.phone,
          },
          notes: {
            customer_name: `${normalizedFormData.firstName} ${normalizedFormData.lastName}`.trim(),
            customer_email: normalizedFormData.email,
            shipping_address: `${normalizedFormData.address1}, ${normalizedFormData.city}, ${normalizedFormData.state} - ${normalizedFormData.postcode}`,
            item_count: String(cartItems.length),
          },
          onSuccess: (razorpayResponse) => {
            // Store confirmation state
            setPaymentSuccess({
              paymentId: razorpayResponse.razorpay_payment_id,
              orderId: razorpayResponse.razorpay_order_id,
              amount: cartTotal,
              customerEmail: normalizedFormData.email,
            });

            // Clear cart
            clearCart();
            setIsSubmitting(false);

            // Notify backend checkout to log WooCommerce record
            fetch("/api/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                billing: normalizedFormData,
                shipping: normalizedFormData,
                cartItems,
                paymentMethod: "razorpay",
                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                razorpayOrderId: razorpayResponse.razorpay_order_id,
              }),
            }).catch((err) => console.warn("WooCommerce order background sync notice:", err));
          },
          onError: (errMsg) => {
            setErrorMsg(errMsg || "Razorpay payment failed. Please try again.");
            setIsSubmitting(false);
          },
          onDismiss: () => {
            setErrorMsg("Payment process was cancelled by user. You can retry when ready.");
            setIsSubmitting(false);
          },
        });
      } catch (err: any) {
        console.error("Razorpay Checkout Error:", err);
        setErrorMsg(err.message || "Failed to initialize Razorpay checkout.");
        setIsSubmitting(false);
      }
    } else {
      // WooCommerce Portal Redirect
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            billing: normalizedFormData,
            shipping: normalizedFormData,
            cartItems,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create order");
        }

        clearCart();

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

  // Render Order Confirmation Screen upon Success
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-between overflow-x-hidden font-sans">
        <Navbar />
        <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 z-10 relative">
          <div className="glass-card p-8 sm:p-12 rounded-[var(--radius-card)] border border-brand-green/30 bg-white/[0.01] text-center space-y-8 shadow-[0_0_50px_rgba(177,243,16,0.1)]">
            <div className="w-20 h-20 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center mx-auto text-brand-green">
              <CheckCircle2 size={44} />
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-brand-green bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20">
                Payment Verified & Confirmed
              </span>
              <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-wider text-white">
                Order Placed Successfully!
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm font-sans max-w-md mx-auto">
                Thank you for your order. We have received your payment via Razorpay and sent a confirmation receipt to{" "}
                <span className="text-white font-mono font-semibold">{paymentSuccess.customerEmail}</span>.
              </p>
            </div>

            {/* Transaction Details */}
            <div className="p-6 rounded-[var(--radius-dropdown)] bg-white/5 border border-white/10 text-left space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-gray-400 uppercase tracking-wider">Amount Paid</span>
                <span className="text-brand-green font-heading font-black text-base">
                  {CURRENCY_SYMBOL}{paymentSuccess.amount}.00
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-gray-400 uppercase tracking-wider">Razorpay Order ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-white">{paymentSuccess.orderId}</span>
                  <button
                    onClick={() => copyToClipboard(paymentSuccess.orderId, "order")}
                    className="text-gray-400 hover:text-brand-green transition-colors"
                    title="Copy Order ID"
                  >
                    {copiedId === "order" ? <Check size={14} className="text-brand-green" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 uppercase tracking-wider">Razorpay Payment ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-white">{paymentSuccess.paymentId}</span>
                  <button
                    onClick={() => copyToClipboard(paymentSuccess.paymentId, "payment")}
                    className="text-gray-400 hover:text-brand-green transition-colors"
                    title="Copy Payment ID"
                  >
                    {copiedId === "payment" ? <Check size={14} className="text-brand-green" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/shop"
                className="px-8 py-4 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-[var(--radius-btn)] hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.4)] transition-all"
              >
                Continue Shopping
              </Link>
              <Link
                href="/account"
                className="px-8 py-4 bg-white/5 text-white border border-white/10 font-heading font-black uppercase tracking-widest text-xs rounded-[var(--radius-btn)] hover:bg-white/10 transition-all"
              >
                View Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-between overflow-x-hidden font-sans">
      <Navbar />

      {/* Razorpay Standard Checkout SDK */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

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
          <div className="text-[10px] text-gray-500 font-mono tracking-wider uppercase bg-white/5 px-3 py-1 rounded border border-white/5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            SECURED RAZORPAY 256-BIT ENCRYPTION
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
            <form onSubmit={handleSubmit} noValidate className="lg:col-span-7 space-y-8">
              <div className="glass-card p-6 sm:p-8 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.01] space-y-6">
                <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                  <h2 className="font-heading font-black text-2xl uppercase tracking-widest text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand-green" />
                    Delivery & Billing Details
                  </h2>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    🇮🇳 India Shipping
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="ENTER FIRST NAME"
                      className={`w-full h-12 px-4 bg-white/5 border rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none transition-all ${
                        fieldErrors.firstName
                          ? "border-red-500/50 text-red-300"
                          : "border-white/10 focus:border-brand-green text-white"
                      }`}
                    />
                    {fieldErrors.firstName && (
                      <p className="text-[10px] text-red-400 font-mono tracking-wider pt-0.5">
                        {fieldErrors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="ENTER LAST NAME"
                      className={`w-full h-12 px-4 bg-white/5 border rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none transition-all ${
                        fieldErrors.lastName
                          ? "border-red-500/50 text-red-300"
                          : "border-white/10 focus:border-brand-green text-white"
                      }`}
                    />
                    {fieldErrors.lastName && (
                      <p className="text-[10px] text-red-400 font-mono tracking-wider pt-0.5">
                        {fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ENTER EMAIL ADDRESS"
                      className={`w-full h-12 px-4 bg-white/5 border rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none transition-all ${
                        fieldErrors.email
                          ? "border-red-500/50 text-red-300"
                          : "border-white/10 focus:border-brand-green text-white"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[10px] text-red-400 font-mono tracking-wider pt-0.5">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      Mobile Number (10 Digits) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-xs">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        maxLength={13}
                        value={formData.phone}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const cleaned = cleanIndianPhone(raw);
                          setFormData((prev) => ({ ...prev, phone: cleaned }));
                          if (isValidIndianPhone(cleaned) && fieldErrors.phone) {
                            setFieldErrors((prev) => {
                              const n = { ...prev };
                              delete n.phone;
                              return n;
                            });
                          }
                        }}
                        placeholder="9876543210"
                        className={`w-full h-12 pl-12 pr-4 bg-white/5 border rounded-[var(--radius-dropdown)] text-xs font-mono tracking-wider focus:outline-none transition-all ${
                          fieldErrors.phone
                            ? "border-red-500/50 text-red-300"
                            : "border-white/10 focus:border-brand-green text-white"
                        }`}
                      />
                      {isValidIndianPhone(cleanIndianPhone(formData.phone)) && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-green">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-[10px] text-red-400 font-mono tracking-wider pt-0.5">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                    Street Address & Locality *
                  </label>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    placeholder="HOUSE / FLAT NO., BUILDING, STREET, AREA"
                    className={`w-full h-12 px-4 bg-white/5 border rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none transition-all mb-3 ${
                      fieldErrors.address1
                        ? "border-red-500/50 text-red-300"
                        : "border-white/10 focus:border-brand-green text-white"
                    }`}
                  />
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    placeholder="LANDMARK, APARTMENT, SUITE, ETC. (OPTIONAL)"
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                  />
                  {fieldErrors.address1 && (
                    <p className="text-[10px] text-red-400 font-mono tracking-wider pt-0.5">
                      {fieldErrors.address1}
                    </p>
                  )}
                </div>

                {/* State, City & PIN Code (Strict Structured Components) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Searchable State Dropdown */}
                  <StateSelect
                    value={formData.state}
                    onChange={(newState) => {
                      setFormData((prev) => ({
                        ...prev,
                        state: newState,
                        // Reset city when state changes so it filters correctly
                        city: "",
                      }));
                      if (fieldErrors.state) {
                        setFieldErrors((prev) => {
                          const n = { ...prev };
                          delete n.state;
                          return n;
                        });
                      }
                    }}
                    error={fieldErrors.state}
                    required
                  />

                  {/* Searchable City Autocomplete */}
                  <CityAutocomplete
                    value={formData.city}
                    onChange={(newCity) => {
                      setFormData((prev) => ({ ...prev, city: newCity }));
                      if (fieldErrors.city) {
                        setFieldErrors((prev) => {
                          const n = { ...prev };
                          delete n.city;
                          return n;
                        });
                      }
                    }}
                    selectedState={formData.state}
                    onSelectState={(matchingState) => {
                      setFormData((prev) => ({ ...prev, state: matchingState }));
                      if (fieldErrors.state) {
                        setFieldErrors((prev) => {
                          const n = { ...prev };
                          delete n.state;
                          return n;
                        });
                      }
                    }}
                    error={fieldErrors.city}
                    required
                  />

                  {/* 6-Digit Indian PIN Code */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                      PIN Code (6 Digits) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="postcode"
                        maxLength={6}
                        value={formData.postcode}
                        onChange={(e) => {
                          // Allow numeric digits only
                          const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setFormData((prev) => ({ ...prev, postcode: digitsOnly }));
                          if (digitsOnly.length === 6 && isValidIndianPinCode(digitsOnly) && fieldErrors.postcode) {
                            setFieldErrors((prev) => {
                              const n = { ...prev };
                              delete n.postcode;
                              return n;
                            });
                          }
                        }}
                        placeholder="190001"
                        className={`w-full h-12 px-4 bg-white/5 border rounded-[var(--radius-dropdown)] text-xs font-mono tracking-widest focus:outline-none transition-all ${
                          fieldErrors.postcode
                            ? "border-red-500/50 text-red-300"
                            : "border-white/10 focus:border-brand-green text-white"
                        }`}
                      />
                      {isValidIndianPinCode(formData.postcode) && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-green">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                    {fieldErrors.postcode && (
                      <p className="text-[10px] text-red-400 font-mono tracking-wider pt-0.5">
                        {fieldErrors.postcode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Gateway Selection */}
              <div className="glass-card p-6 sm:p-8 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.01] space-y-4">
                <h3 className="font-heading font-black text-lg uppercase tracking-wider text-white flex items-center justify-between">
                  <span>Select Payment Gateway</span>
                  <span className="text-[10px] font-mono text-brand-green bg-brand-green/10 px-2 py-0.5 rounded border border-brand-green/20">
                    Instant & Secure
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Razorpay Option */}
                  <label
                    className={`cursor-pointer p-4 rounded-[var(--radius-dropdown)] border transition-all flex items-start gap-3 ${
                      paymentMethod === "razorpay"
                        ? "bg-brand-green/10 border-brand-green text-white shadow-[0_0_15px_rgba(177,243,16,0.15)]"
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="mt-1 accent-brand-green"
                    />
                    <div className="space-y-1">
                      <div className="font-heading font-bold uppercase text-xs tracking-wider text-white flex items-center gap-2">
                        Razorpay Standard
                        <span className="text-[9px] bg-brand-green text-brand-black px-1.5 py-0.2 rounded font-mono font-bold">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                        Cards (Visa/Mastercard/RuPay), UPI (GPay, PhonePe, Paytm), NetBanking & Wallets.
                      </p>
                    </div>
                  </label>

                  {/* Direct WooCommerce Option */}
                  <label
                    className={`cursor-pointer p-4 rounded-[var(--radius-dropdown)] border transition-all flex items-start gap-3 ${
                      paymentMethod === "woocommerce"
                        ? "bg-brand-green/10 border-brand-green text-white shadow-[0_0_15px_rgba(177,243,16,0.15)]"
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="woocommerce"
                      checked={paymentMethod === "woocommerce"}
                      onChange={() => setPaymentMethod("woocommerce")}
                      className="mt-1 accent-brand-green"
                    />
                    <div className="space-y-1">
                      <div className="font-heading font-bold uppercase text-xs tracking-wider text-white">
                        WooCommerce Portal
                      </div>
                      <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                        Redirect to WooCommerce store pay portal.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Checkout Terms and Error */}
              <div className="space-y-4">
                <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                  By placing your order, you agree to our terms of service and refund policies. All transactions are authenticated through Razorpay 256-bit SSL encrypted channels.
                </p>

                {errorMsg && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded font-mono uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 uppercase tracking-widest font-heading font-black text-sm rounded-[var(--radius-btn)] transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 cursor-pointer ${
                    isSubmitting
                      ? "bg-brand-green/20 text-brand-green border border-brand-green/30 cursor-not-allowed"
                      : "bg-brand-green text-brand-black hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.4)]"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">LAUNCHING PAYMENT MODAL...</span>
                  ) : (
                    <span>
                      {paymentMethod === "razorpay"
                        ? `PAY WITH RAZORPAY (${CURRENCY_SYMBOL}${cartTotal}.00)`
                        : `PROCEED TO WOOCOMMERCE PAY (${CURRENCY_SYMBOL}${cartTotal}.00)`}
                    </span>
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
                      key={`${item.id}-${item.size}-${item.color || ""}`}
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
                          QTY: {item.quantity} | Size: {item.size}{item.color ? ` | Color: ${item.color}` : ""}
                        </div>
                      </div>
                      <div className="font-heading font-black text-brand-green tracking-widest text-xs">
                        {CURRENCY_SYMBOL}{item.price * item.quantity}.00
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-white/10" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="uppercase tracking-widest">Subtotal</span>
                    <span className="font-mono text-brand-green">{CURRENCY_SYMBOL}{cartTotal}.00</span>
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
                      {CURRENCY_SYMBOL}{cartTotal}.00
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
                      Razorpay Trusted Partner
                    </span>
                    PCI-DSS Level 1 certified gateway. Cards, UPI, NetBanking, and wallets processed without storing credentials.
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <Truck size={20} className="text-brand-green shrink-0" />
                  <div>
                    <span className="font-bold text-white block uppercase tracking-wider text-[10px]">
                      Express Global Shipping
                    </span>
                    Orders are processed immediately after verified payment confirmation.
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
