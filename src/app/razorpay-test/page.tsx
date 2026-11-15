"use client";

import { useState } from "react";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, CreditCard } from "lucide-react";
import RazorpayCheckoutButton from "@/components/checkout/RazorpayCheckoutButton";
import { CURRENCY_SYMBOL } from "@/lib/utils";

export default function RazorpayTestPage() {
  const [testAmountRupees, setTestAmountRupees] = useState("1.00");
  const [customerName, setCustomerName] = useState("Test Shopper");
  const [customerEmail, setCustomerEmail] = useState("test@yubbydubby.com");
  const [customerContact, setCustomerContact] = useState("9876543210");

  const [logs, setLogs] = useState<Array<{ time: string; message: string; type: "info" | "success" | "error" }>>([]);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const addLog = (message: string, type: "info" | "success" | "error" = "info") => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ time, message, type }, ...prev]);
  };

  const amountInPaise = Math.max(100, Math.round((parseFloat(testAmountRupees) || 1) * 100));

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col justify-between overflow-x-hidden font-sans">
      <Navbar />

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 z-10 relative">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2 border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-brand-green uppercase tracking-widest">
              <ShieldCheck size={16} />
              Razorpay Standard Checkout Diagnostic Suite
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-wider text-white">
              Razorpay Payment Gateway Test
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm font-sans max-w-2xl">
              Use this interactive test console to trigger test mode transactions with the configured Razorpay Test Key, verify the backend order creation endpoint, and inspect HMAC-SHA256 signature verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Payment Test Controls */}
            <div className="glass-card p-6 sm:p-8 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.01] space-y-6">
              <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-white flex items-center gap-2">
                <CreditCard size={20} className="text-brand-green" />
                Test Parameters
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                    Test Amount (INR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green font-mono font-bold">
                      {CURRENCY_SYMBOL}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="1.00"
                      value={testAmountRupees}
                      onChange={(e) => setTestAmountRupees(e.target.value)}
                      className="w-full h-12 pl-8 pr-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono block">
                    Calculated: {amountInPaise} paise (Minimum 100 paise)
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-mono">
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs font-mono tracking-wider focus:outline-none focus:border-brand-green transition-all"
                  />
                </div>
              </div>

              {/* Checkout Trigger */}
              <div className="pt-2">
                <RazorpayCheckoutButton
                  amountInPaise={amountInPaise}
                  currency="INR"
                  label={`TEST PAY ${CURRENCY_SYMBOL}${parseFloat(testAmountRupees || "1").toFixed(2)}`}
                  description="Razorpay Integration Verification Test"
                  prefill={{
                    name: customerName,
                    email: customerEmail,
                    contact: customerContact,
                  }}
                  onSuccess={(res, verifyData) => {
                    addLog(`Payment verified! ID: ${res.razorpay_payment_id}`, "success");
                    setVerificationResult({
                      ...res,
                      ...verifyData,
                    });
                  }}
                  onError={(err) => {
                    addLog(`Payment error: ${err}`, "error");
                  }}
                  onDismiss={() => {
                    addLog("Payment modal dismissed by user.", "info");
                  }}
                />
              </div>

              {/* Razorpay Test Credentials Info */}
              <div className="p-4 rounded-[var(--radius-dropdown)] bg-white/5 border border-white/5 space-y-2 text-[11px] text-gray-400">
                <div className="font-bold text-white uppercase tracking-wider text-[10px] font-mono">
                  Test Cards (Razorpay Sandbox):
                </div>
                <div className="font-mono text-[10px] text-gray-300">
                  Card: <span className="text-brand-green">4111 1111 1111 1111</span>
                  <br />
                  Expiry: <span className="text-brand-green">12/30</span> | CVV: <span className="text-brand-green">123</span>
                  <br />
                  OTP: Any 6 digits (e.g. 123456)
                </div>
              </div>
            </div>

            {/* Live Activity Logs & Verification State */}
            <div className="space-y-6">
              {/* Verification Outcome Card */}
              {verificationResult && (
                <div className="glass-card p-6 rounded-[var(--radius-card)] border border-brand-green/30 bg-brand-green/[0.02] space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-brand-green shrink-0" />
                    <div>
                      <h4 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                        Payment & Signature Verified!
                      </h4>
                      <p className="text-[11px] text-gray-400 font-sans">
                        HMAC-SHA256 signature verified with server secret.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-black/60 rounded font-mono text-[10px] space-y-1 border border-white/5">
                    <div>
                      <span className="text-gray-500">Order ID: </span>
                      <span className="text-white">{verificationResult.razorpay_order_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment ID: </span>
                      <span className="text-brand-green">{verificationResult.razorpay_payment_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Signature: </span>
                      <span className="text-gray-300 break-all">{verificationResult.razorpay_signature}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Logs */}
              <div className="glass-card p-6 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.01] space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">
                    Console Logs
                  </h3>
                  <button
                    onClick={() => {
                      setLogs([]);
                      setVerificationResult(null);
                    }}
                    className="text-[10px] font-mono text-gray-500 hover:text-brand-green flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw size={12} />
                    Clear
                  </button>
                </div>

                <div className="h-64 overflow-y-auto space-y-2 pr-2 font-mono text-xs">
                  {logs.length === 0 ? (
                    <div className="text-gray-600 text-center py-16 text-[11px]">
                      No events yet. Click &quot;TEST PAY&quot; to begin.
                    </div>
                  ) : (
                    logs.map((log, index) => (
                      <div
                        key={index}
                        className={`p-2.5 rounded text-[11px] border ${
                          log.type === "success"
                            ? "bg-brand-green/10 border-brand-green/30 text-brand-green"
                            : log.type === "error"
                            ? "bg-red-500/10 border-red-500/30 text-red-400"
                            : "bg-white/5 border-white/5 text-gray-300"
                        }`}
                      >
                        <span className="text-gray-500 text-[10px] mr-2">[{log.time}]</span>
                        {log.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
