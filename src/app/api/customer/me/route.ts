import { NextRequest, NextResponse } from "next/server";
import { fetchWooCommerce } from "@/lib/woocommerce";
import { getAuthenticatedUserId } from "@/lib/auth-helper";

/**
 * GET - Retrieve the authenticated user's WooCommerce customer profile details
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Access denied. Valid login token is required." },
        { status: 401 }
      );
    }

    console.log(`Fetching customer profile for WordPress User ID: ${userId}...`);

    // Fetch the customer details from WooCommerce securely using the Admin client
    const customer: any = await fetchWooCommerce(`customers/${userId}`);

    if (!customer || !customer.id) {
      return NextResponse.json(
        { error: "Customer profile not found on backend." },
        { status: 404 }
      );
    }

    // Return only necessary profile specifications to the client
    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      username: customer.username,
      billing: {
        firstName: customer.billing?.first_name || "",
        lastName: customer.billing?.last_name || "",
        address1: customer.billing?.address_1 || "",
        address2: customer.billing?.address_2 || "",
        city: customer.billing?.city || "",
        state: customer.billing?.state || "",
        postcode: customer.billing?.postcode || "",
        country: customer.billing?.country || "",
        phone: customer.billing?.phone || "",
      },
      shipping: {
        firstName: customer.shipping?.first_name || "",
        lastName: customer.shipping?.last_name || "",
        address1: customer.shipping?.address_1 || "",
        address2: customer.shipping?.address_2 || "",
        city: customer.shipping?.city || "",
        state: customer.shipping?.state || "",
        postcode: customer.shipping?.postcode || "",
        country: customer.shipping?.country || "",
      },
    });
  } catch (error: any) {
    console.error("GET Customer Profile Error:", error);
    return NextResponse.json(
      { error: "Failed to load profile. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update the authenticated user's customer profile details (billing/shipping/phone)
 */
export async function PUT(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Access denied. Valid login token is required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { firstName, lastName, phone, billing, shipping } = body;

    console.log(`Updating customer profile for WordPress User ID: ${userId}...`);

    // Construct the WooCommerce customer update payload
    const updatePayload: any = {};
    if (firstName) updatePayload.first_name = firstName;
    if (lastName) updatePayload.last_name = lastName;

    if (billing) {
      updatePayload.billing = {
        first_name: billing.firstName || firstName || "",
        last_name: billing.lastName || lastName || "",
        address_1: billing.address1 || "",
        address_2: billing.address2 || "",
        city: billing.city || "",
        state: billing.state || "",
        postcode: billing.postcode || "",
        country: billing.country || "",
        phone: billing.phone || phone || "",
        email: billing.email || "",
      };
    }

    if (shipping) {
      updatePayload.shipping = {
        first_name: shipping.firstName || firstName || "",
        last_name: shipping.lastName || lastName || "",
        address_1: shipping.address1 || "",
        address_2: shipping.address2 || "",
        city: shipping.city || "",
        state: shipping.state || "",
        postcode: shipping.postcode || "",
        country: shipping.country || "",
      };
    }

    // Call WooCommerce REST API to update the profile securely
    const customer: any = await fetchWooCommerce(`customers/${userId}`, {
      method: "PUT",
      body: JSON.stringify(updatePayload),
    });

    if (!customer || !customer.id) {
      throw new Error("WooCommerce profile update did not return customer details.");
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error: any) {
    console.error("PUT Customer Profile Error:", error);
    return NextResponse.json(
      { error: "Failed to update profile specifications. Please try again." },
      { status: 500 }
    );
  }
}
