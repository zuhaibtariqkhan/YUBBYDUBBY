import { NextRequest, NextResponse } from "next/server";
import { fetchWooCommerce } from "@/lib/woocommerce";
import fs from "fs";
import path from "path";

const OTP_STORE_PATH = path.join(process.cwd(), "otp-store.json");

function isOtpVerified(email?: string, phone?: string): boolean {
  try {
    if (fs.existsSync(OTP_STORE_PATH)) {
      const content = fs.readFileSync(OTP_STORE_PATH, "utf8");
      const store = JSON.parse(content || "{}");
      const cleanEmail = email ? email.toLowerCase().trim() : null;
      const cleanPhone = phone ? phone.trim() : null;
      const storeKey = cleanEmail || cleanPhone;

      if (!storeKey) return false;

      const record = store[storeKey];
      if (!record) return false;

      if (record.email && record.email !== cleanEmail) return false;
      if (record.phone && record.phone !== cleanPhone) return false;

      return !!record.verified;
    }
  } catch (error) {
    console.error("Error reading OTP store in register route:", error);
  }
  return false;
}

function clearOtpRecord(email?: string, phone?: string) {
  try {
    if (fs.existsSync(OTP_STORE_PATH)) {
      const content = fs.readFileSync(OTP_STORE_PATH, "utf8");
      const store = JSON.parse(content || "{}");
      const cleanEmail = email ? email.toLowerCase().trim() : null;
      const cleanPhone = phone ? phone.trim() : null;
      const storeKey = cleanEmail || cleanPhone;

      if (storeKey) {
        delete store[storeKey];
        fs.writeFileSync(OTP_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
      }
    }
  } catch (error) {
    console.error("Error clearing OTP record in register route:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, password, firstName, lastName } = body;

    if (!password || !firstName || !lastName || (!email && !phone)) {
      return NextResponse.json(
        { error: "First name, last name, password, and at least email or mobile phone number are required." },
        { status: 400 }
      );
    }

    // Enforce server-side OTP verification
    if (!isOtpVerified(email, phone)) {
      return NextResponse.json(
        { error: "Verification check failed. Please verify your email and/or mobile phone via OTP first." },
        { status: 400 }
      );
    }

    // WooCommerce requires an email address. If they didn't provide one, generate a placeholder based on phone.
    const cleanEmail = email ? email.toLowerCase().trim() : `phone-${phone.replace(/[^0-9]/g, "")}@yubbydubby.com`;
    const cleanPhone = phone ? phone.trim() : "";

    // Construct the WooCommerce Customer creation payload
    const customerPayload = {
      email: cleanEmail,
      username: cleanPhone || cleanEmail, // Store phone as username, fallback to email
      first_name: firstName,
      last_name: lastName,
      password,
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: cleanEmail,
        phone: cleanPhone,
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
      }
    };

    console.log(`Registering customer: ${cleanEmail} with username: ${customerPayload.username} on WooCommerce...`);

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
    clearOtpRecord(email, phone);

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
