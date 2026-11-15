import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Support both Razorpay modal response keys and canonical parameter names
    const order_id = body.razorpay_order_id || body.order_id;
    const payment_id = body.razorpay_payment_id || body.payment_id;
    const signature = body.razorpay_signature || body.signature;

    // Validate missing fields -> return 400
    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required verification fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.",
        },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: RAZORPAY_KEY_SECRET is not set.",
        },
        { status: 500 }
      );
    }

    // Verify HMAC-SHA256 signature
    let isValid = false;
    try {
      isValid = verifySignature({
        order_id: String(order_id),
        payment_id: String(payment_id),
        signature: String(signature),
      });
    } catch (err: any) {
      console.error("Signature verification error:", err);
      return NextResponse.json(
        {
          success: false,
          error: "Error verifying signature: " + (err?.message || "Invalid signature format."),
        },
        { status: 400 }
      );
    }

    // Signature mismatch -> return 400, do NOT mark as paid
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid signature: Payment verification failed. Transaction cannot be validated.",
        },
        { status: 400 }
      );
    }

    // Success -> return 200
    return NextResponse.json(
      {
        success: true,
        message: "Payment signature verified successfully.",
        order_id,
        payment_id,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Payment Verification Route Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Internal server error during payment verification.",
      },
      { status: 500 }
    );
  }
}
