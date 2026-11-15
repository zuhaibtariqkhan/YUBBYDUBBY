import Razorpay from "razorpay";
import crypto from "crypto";

export interface CreateOrderParams {
  amount: number; // in paise
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface VerifyPaymentParams {
  order_id: string;
  payment_id: string;
  signature: string;
}

/**
 * Resolves Razorpay credentials from environment variables with safe fallback.
 */
export function getRazorpayCredentials() {
  const key_id =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "rzp_test_U0QNUHkzdwAtY4";

  const key_secret =
    process.env.RAZORPAY_KEY_SECRET ||
    "5soXvduQsVkJ3Hq56WXIxQLr";

  return { key_id, key_secret };
}

/**
 * Initializes and returns a Razorpay SDK instance.
 */
export function getRazorpayInstance(): Razorpay {
  const { key_id, key_secret } = getRazorpayCredentials();

  if (!key_id || !key_secret) {
    throw new Error("Razorpay credentials (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET) are missing.");
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Verifies Razorpay payment signature using HMAC-SHA256:
 * generated_signature = HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 */
export function verifySignature({ order_id, payment_id, signature }: VerifyPaymentParams): boolean {
  const { key_secret } = getRazorpayCredentials();

  if (!key_secret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(`${order_id}|${payment_id}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "utf-8");
  const providedBuffer = Buffer.from(signature, "utf-8");

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}
