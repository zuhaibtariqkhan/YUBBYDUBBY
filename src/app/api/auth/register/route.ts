import { NextRequest, NextResponse } from "next/server";
import { fetchWooCommerce } from "@/lib/woocommerce";
import { verifyPayload } from "@/lib/otp-token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, verifiedToken, gender } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "First name, last name, email address, and password are required." },
        { status: 400 }
      );
    }

    if (!verifiedToken) {
      return NextResponse.json(
        { error: "Verification authorization token is missing. Please verify your email OTP first." },
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

    // Construct the WooCommerce Customer creation payload
    const customerPayload: any = {
      email: cleanEmail,
      username: cleanEmail, // Store email as username
      first_name: firstName,
      last_name: lastName,
      password,
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: cleanEmail,
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
      }
    };

    if (gender) {
      customerPayload.meta_data = [
        {
          key: "gender",
          value: gender
        }
      ];
    }

    console.log(`Registering WooCommerce customer: ${cleanEmail}...`);

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
