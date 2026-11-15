"use client";

import React, { useState } from "react";
import { executeRazorpayCheckout, RazorpaySuccessResponse } from "@/lib/razorpay-client";
import { ShieldCheck, Loader2 } from "lucide-react";

export interface RazorpayCheckoutButtonProps {
  /**
   * Amount in paise (1 INR = 100 paise).
   * For example, ₹500 should be passed as 50000.
   */
  amountInPaise: number;
  currency?: string;
  receipt?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess?: (response: RazorpaySuccessResponse, verifyData: any) => void;
  onError?: (error: string) => void;
  onDismiss?: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function RazorpayCheckoutButton({
  amountInPaise,
  currency = "INR",
  receipt,
  description = "YUBBY DUBBY Store Checkout",
  prefill,
  notes,
  onSuccess,
  onError,
  onDismiss,
  label = "PAY WITH RAZORPAY",
  className = "",
  disabled = false,
}: RazorpayCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    if (disabled || isLoading) return;

    if (amountInPaise < 100) {
      setErrorMessage("Minimum order amount is 100 paise (₹1.00).");
      onError?.("Minimum order amount is 100 paise (₹1.00).");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await executeRazorpayCheckout({
        amount: amountInPaise,
        currency,
        receipt,
        description,
        prefill,
        notes,
        onModalOpen: () => {
          setIsLoading(false);
        },
        onSuccess: (res, verifyData) => {
          setIsLoading(false);
          setErrorMessage(null);
          onSuccess?.(res, verifyData);
        },
        onError: (err) => {
          setIsLoading(false);
          setErrorMessage(err);
          onError?.(err);
        },
        onDismiss: () => {
          setIsLoading(false);
          onDismiss?.();
        },
      });
    } catch (err: any) {
      setIsLoading(false);
      const msg = err?.message || "An unexpected error occurred while launching Razorpay.";
      setErrorMessage(msg);
      onError?.(msg);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        onClick={handlePayment}
        disabled={disabled || isLoading}
        className={`w-full py-4 uppercase tracking-widest font-heading font-black text-sm rounded-[var(--radius-btn)] transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2 ${
          disabled || isLoading
            ? "bg-brand-green/20 text-brand-green/50 border border-brand-green/20 cursor-not-allowed"
            : "bg-brand-green text-brand-black hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.4)]"
        } ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span className="font-mono text-xs">CONNECTING RAZORPAY...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{label}</span>
          </>
        )}
      </button>

      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded font-mono uppercase tracking-wider text-center">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
