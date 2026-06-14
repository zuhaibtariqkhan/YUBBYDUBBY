import { NextRequest, NextResponse } from "next/server";
import { fetchWooCommerce } from "@/lib/woocommerce";
import { verifyPayload } from "@/lib/otp-token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, password, firstName, lastName, verifiedToken } = body;

    if (!password || !firstName || !lastName || (!email && !phone)) {
      return NextResponse.json(
        { error: "First name, last name, password, and at least email or mobile phone number are required." },
        { status: 400 }
      );
    }

    if (!verifiedToken) {
      return NextResponse.json(
        { error: "Verification authorization token is missing. Please verify your OTP first." },
        { status: 400 }
      );
    }

    // Enforce server-side OTP token verification
    const payload = verifyPayload(verifiedToken);
    if (!payload || !payload.verified) {
      return NextResponse.json(
        { error: "Verification check failed or session has expired. Please verify your credentials via OTP first." },
        { status: 400 }
      );
    }

    // Ensure email/phone match the payload data
    const cleanEmail = email ? email.toLowerCase().trim() : null;
    const cleanPhone = phone ? phone.trim() : null;

    if (cleanEmail && payload.email !== cleanEmail) {
      return NextResponse.json({ error: "Submitted email does not match verified OTP credentials." }, { status: 400 });
    }
    if (cleanPhone && payload.phone !== cleanPhone) {
      return NextResponse.json({ error: "Submitted mobile phone does not match verified OTP credentials." }, { status: 400 });
    }

    // WooCommerce requires a valid email. Generate a placeholder if only phone is provided.
    const wcEmail = cleanEmail || `phone-${cleanPhone?.replace(/[^0-9]/g, "")}@yubbydubby.com`;
    const wcPhone = cleanPhone || "";

    // Construct the WooCommerce Customer creation payload
    const customerPayload = {
      email: wcEmail,
      username: wcPhone || wcEmail, // Store phone as username, fallback to email
      first_name: firstName,
      last_name: lastName,
      password,
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: wcEmail,
        phone: wcPhone,
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
      }
    };

    console.log(`Registering WooCommerce customer: ${wcEmail} with username: ${customerPayload.username}...`);

    // Call WooCommerce customers endpoint securely using admin credentials
    const customer: any = await fetchWooCommerce("customers", {
      method: "POST",
      body: JSON.stringify(customerPayload),
    });

    if (!customer || !customer.id) {
      throw new Error("WooCommerce registration failed to return customer details.");
    }

    console.log(`Successfully registered WooCommerce customer ID: ${customer.id}`);

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully.",
      customerId: customer.id,
      email: customer.email,
      phone: customer.billing?.phone || wcPhone,
    });
  } catch (error: any) {
    console.error("WooCommerce Registration Error:", error);
    
    // Clean and return direct friendly error message from WooCommerce REST API
    const rawMessage = error?.message || "";
    const cleanMessage = rawMessage.replace(/<[^>]*>/g, '').trim() || "Failed to register account. Please check your details.";

    return NextResponse.json(
      { error: cleanMessage, details: rawMessage },
      { status: 500 }
    );
  }
}
