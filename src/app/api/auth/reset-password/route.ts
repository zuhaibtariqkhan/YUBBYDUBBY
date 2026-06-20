import { NextRequest, NextResponse } from "next/server";
import { fetchWooCommerce } from "@/lib/woocommerce";
import { verifyPayload } from "@/lib/otp-token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, verifiedToken } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email address and new password are required." },
        { status: 400 }
      );
    }

    if (!verifiedToken) {
      return NextResponse.json(
        { error: "Reset verification authorization token is missing. Please verify your OTP first." },
        { status: 400 }
      );
    }

    // Enforce server-side OTP token verification
    const payload = verifyPayload(verifiedToken);
    if (!payload || !payload.verified) {
      return NextResponse.json(
        { error: "Verification check failed or session has expired. Please verify your email via OTP first." },
        { status: 400 }
      );
    }

    // Ensure email matches the payload data
    const cleanEmail = email.toLowerCase().trim();
    if (payload.email !== cleanEmail) {
      return NextResponse.json({ error: "Submitted email does not match verified OTP credentials." }, { status: 400 });
    }

    console.log(`Locating WooCommerce customer ID for email: ${cleanEmail}...`);

    // 1. Fetch customer details by email to find their ID (bypass Next.js fetch caching)
    const customers: any = await fetchWooCommerce(`customers?email=${encodeURIComponent(cleanEmail)}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    
    if (!Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json(
        { error: "No registered profile was found with this email address." },
        { status: 404 }
      );
    }

    const customerId = customers[0].id;
    console.log(`Found WooCommerce Customer ID: ${customerId}. Resetting password...`);

    // 2. Perform the secure profile password update
    const updateResult: any = await fetchWooCommerce(`customers/${customerId}`, {
      method: "PUT",
      body: JSON.stringify({
        password: password,
      }),
    });

    if (!updateResult || !updateResult.id) {
      throw new Error("WooCommerce customer password update endpoint failed to return details.");
    }

    console.log(`Successfully reset WooCommerce password for Customer ID: ${customerId}`);

    return NextResponse.json({
      success: true,
      message: "Password has been successfully updated.",
    });
  } catch (error: any) {
    console.error("WooCommerce Password Reset Error:", error);
    const rawMessage = error?.message || "";
    const cleanMessage = rawMessage.replace(/<[^>]*>/g, '').trim() || "Failed to reset password. Please try again.";

    return NextResponse.json(
      { error: cleanMessage, details: rawMessage },
      { status: 500 }
    );
  }
}
