import { NextRequest, NextResponse } from "next/server";
import { getRazorpayInstance, getRazorpayCredentials } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount, currency = "INR", receipt, notes } = body;

    const numericAmount = Number(amount);

    // Validate amount >= 100 paise (1 INR = 100 paise)
    if (isNaN(numericAmount) || numericAmount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Amount must be at least 100 paise (₹1)." },
        { status: 400 }
      );
    }

    const { key_id, key_secret } = getRazorpayCredentials();

    // Verify credentials presence
    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: "Authentication failure: Razorpay API credentials are not configured on the server." },
        { status: 401 }
      );
    }

    let razorpay;
    try {
      razorpay = getRazorpayInstance();
    } catch {
      return NextResponse.json(
        { error: "Authentication failure: Failed to initialize Razorpay SDK." },
        { status: 401 }
      );
    }

    const receiptId = receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Create order via Razorpay API (POST https://api.razorpay.com/v1/orders)
    const order = await razorpay.orders.create({
      amount: Math.round(numericAmount),
      currency: currency.toUpperCase(),
      receipt: receiptId,
      notes: typeof notes === "object" && notes !== null ? notes : {},
    });

    return NextResponse.json(
      {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: key_id,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Razorpay Order Creation Error:", err);

    // Check for Razorpay authentication failures (HTTP 401)
    if (
      err?.statusCode === 401 ||
      err?.status === 401 ||
      err?.error?.code === "BAD_REQUEST_ERROR" &&
      err?.error?.description?.toLowerCase().includes("authenticate")
    ) {
      return NextResponse.json(
        { error: "Authentication failure with Razorpay API. Verify KEY_ID and KEY_SECRET." },
        { status: 401 }
      );
    }

    // Razorpay API or server error (HTTP 500)
    return NextResponse.json(
      {
        error: err?.error?.description || err?.message || "Failed to create Razorpay order.",
      },
      { status: 500 }
    );
  }
}
