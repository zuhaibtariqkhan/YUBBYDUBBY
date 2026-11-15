/**
 * Client-side Razorpay script loader and checkout handler.
 */

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface OpenRazorpayOptions {
  amount: number; // in paise
  currency?: string;
  receipt?: string;
  name?: string;
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
  onModalOpen?: () => void;
}

/**
 * Dynamically loads the Razorpay Standard Checkout script.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay checkout script.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Executes full Razorpay checkout flow:
 * 1. Calls /api/create-order
 * 2. Opens the Razorpay modal with resolved key_id
 * 3. On success, calls /api/verify-payment with order_id, payment_id, signature
 */
export async function executeRazorpayCheckout(options: OpenRazorpayOptions): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    throw new Error("Unable to load Razorpay Checkout SDK. Please check your internet connection.");
  }

  // 1. Create order on backend
  const createRes = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: options.amount,
      currency: options.currency || "INR",
      receipt: options.receipt,
      notes: options.notes,
    }),
  });

  const createData = await createRes.json();
  if (!createRes.ok || !createData.order_id) {
    throw new Error(createData.error || "Failed to create Razorpay order.");
  }

  // Public key resolution: from server response, or client env, or fallback test key
  const key_id =
    createData.key_id ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "rzp_test_U0QNUHkzdwAtY4";

  if (!key_id) {
    throw new Error("Razorpay Key ID is missing. Please configure NEXT_PUBLIC_RAZORPAY_KEY_ID.");
  }

  options.onModalOpen?.();

  // 2. Open Razorpay modal
  return new Promise<void>((resolve, reject) => {
    const rzpOptions = {
      key: key_id,
      amount: createData.amount,
      currency: createData.currency || "INR",
      name: options.name || "YUBBY DUBBY",
      description: options.description || "Lifestyle & Apparel Order",
      image: "/logo.png",
      order_id: createData.order_id,
      prefill: {
        name: options.prefill?.name || "",
        email: options.prefill?.email || "",
        contact: options.prefill?.contact || "",
      },
      theme: {
        color: "#B1F310", // Yubby Dubby neon green
        backdrop_color: "rgba(0,0,0,0.85)",
      },
      handler: async function (response: RazorpaySuccessResponse) {
        try {
          // 3. Verify signature on backend
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            options.onSuccess?.(response, verifyData);
            resolve();
          } else {
            const errMsg = verifyData.error || "Payment signature verification failed.";
            options.onError?.(errMsg);
            reject(new Error(errMsg));
          }
        } catch (err: any) {
          const errMsg = err?.message || "Failed to communicate with payment verification server.";
          options.onError?.(errMsg);
          reject(err);
        }
      },
      modal: {
        ondismiss: function () {
          options.onDismiss?.();
          resolve();
        },
      },
    };

    const rzp = new window.Razorpay(rzpOptions);

    rzp.on("payment.failed", function (response: any) {
      const errMsg =
        response?.error?.description ||
        response?.error?.reason ||
        "Payment transaction failed or was declined by issuing bank.";
      options.onError?.(errMsg);
      reject(new Error(errMsg));
    });

    rzp.open();
  });
}
