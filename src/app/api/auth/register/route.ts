import { NextRequest, NextResponse } from "next/server";
import { fetchWooCommerce } from "@/lib/woocommerce";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All registration specifications (email, password, first name, last name) are required." },
        { status: 400 }
      );
    }

    // Construct the WooCommerce Customer creation payload
    const customerPayload = {
      email,
      first_name: firstName,
      last_name: lastName,
      password,
    };

    console.log(`Registering customer: ${email} on WooCommerce...`);

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
    
    // Check if the email already exists or there is a specific error message
    const rawMessage = error?.message || "";
    let cleanMessage = "Failed to register account. Please check your details.";
    if (rawMessage.includes("registration-error-email-exists")) {
      cleanMessage = "An account with this email address is already registered.";
    } else if (rawMessage.includes("400")) {
      cleanMessage = "Invalid account details. Password must be strong, or email is malformed.";
    }

    return NextResponse.json(
      { error: cleanMessage, details: rawMessage },
      { status: 500 }
    );
  }
}
