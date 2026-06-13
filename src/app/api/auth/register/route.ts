import { NextRequest, NextResponse } from "next/server";
import { fetchWooCommerce } from "@/lib/woocommerce";
import fs from "fs";
import path from "path";

const OTP_STORE_PATH = path.join(process.cwd(), "otp-store.json");

function isOtpVerified(email: string, phone: string): boolean {
  try {
    if (fs.existsSync(OTP_STORE_PATH)) {
      const content = fs.readFileSync(OTP_STORE_PATH, "utf8");
      const store = JSON.parse(content || "{}");
      const record = store[email.toLowerCase().trim()];
      return !!(record && record.phone === phone.trim() && record.verified);
    }
  } catch (error) {
    console.error("Error reading OTP store in register route:", error);
  }
  return false;
}

function clearOtpRecord(email: string) {
  try {
    if (fs.existsSync(OTP_STORE_PATH)) {
      const content = fs.readFileSync(OTP_STORE_PATH, "utf8");
      const store = JSON.parse(content || "{}");
      delete store[email.toLowerCase().trim()];
      fs.writeFileSync(OTP_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
    }
  } catch (error) {
    console.error("Error clearing OTP record in register route:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, password, firstName, lastName } = body;

    if (!email || !phone || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All registration specifications (email, phone, password, first name, last name) are required." },
        { status: 400 }
      );
    }

    // Enforce server-side OTP verification
    if (!isOtpVerified(email, phone)) {
      return NextResponse.json(
        { error: "Verification check failed. Please verify your email and mobile phone via OTP first." },
        { status: 400 }
      );
    }

    // Construct the WooCommerce Customer creation payload
    const customerPayload = {
      email,
      username: phone, // Store phone as username so they can login with it
      first_name: firstName,
      last_name: lastName,
      password,
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
      }
    };

    console.log(`Registering customer: ${email} with phone: ${phone} on WooCommerce...`);

    // Call WooCommerce customers endpoint securely using admin credentials
    const customer: any = await fetchWooCommerce("customers", {
      method: "POST",
      body: JSON.stringify(customerPayload),
    });

    if (!customer || !customer.id) {
      throw new Error("WooCommerce registration failed to return customer details.");
    }

    console.log(`Successfully registered WooCommerce customer ID: ${customer.id}`);

    // Clear the OTP verification entry on successful registration
    clearOtpRecord(email);

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully.",
      customerId: customer.id,
      email: customer.email,
      phone: customer.billing?.phone || phone,
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
