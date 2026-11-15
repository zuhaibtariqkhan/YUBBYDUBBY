import { NextRequest, NextResponse } from "next/server";
import { fetchWooCommerce } from "@/lib/woocommerce";
import { isValidIndianPinCode, isValidIndianPhone, isValidIndianState } from "@/lib/india-locations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { billing, shipping, cartItems } = body;

    if (!billing || !shipping || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Missing required order parameters." },
        { status: 400 }
      );
    }

    // Server-Side Delivery Validation
    if (!billing.firstName || billing.firstName.trim().length < 2) {
      return NextResponse.json(
        { error: "First name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    if (!billing.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address for delivery updates." },
        { status: 400 }
      );
    }

    if (!isValidIndianPhone(billing.phone)) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    if (!billing.address1 || billing.address1.trim().length < 5) {
      return NextResponse.json(
        { error: "Street address must be at least 5 characters long." },
        { status: 400 }
      );
    }

    if (!isValidIndianState(billing.state)) {
      return NextResponse.json(
        { error: "Please select a valid Indian State or Union Territory." },
        { status: 400 }
      );
    }

    if (!billing.city || billing.city.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid City or District." },
        { status: 400 }
      );
    }

    if (!isValidIndianPinCode(billing.postcode)) {
      return NextResponse.json(
        { error: "Please provide a valid 6-digit Indian PIN code." },
        { status: 400 }
      );
    }

    // Map cart items to WooCommerce line items
    // If the ID is a string, we parse it to a number.
    const line_items = cartItems.map((item: any) => {
      const parsedId = parseInt(item.id, 10);
      
      const meta_data = [
        {
          key: "Size",
          value: item.size || "M",
        },
      ];

      if (item.color) {
        meta_data.push({
          key: "Color",
          value: item.color,
        });
      }

      // Attach print-on-demand custom uploaded image and custom text layers to WooCommerce order metadata
      if (item.customImage) {
        meta_data.push({
          key: "Custom Design Image",
          value: item.customImage, // Holds the full HD base64 image data or custom template name
        });
      }

      if (item.customText) {
        meta_data.push({
          key: "Custom Text Layer",
          value: item.customText,
        });
      }

      const lineItem: any = {
        product_id: isNaN(parsedId) ? 0 : parsedId,
        quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
        meta_data,
      };

      // Enforce server-side pricing: for standard catalog products (product_id > 0),
      // omit subtotal/total so WooCommerce resolves canonical catalog pricing.
      // For custom print items without a catalog product_id, enforce minimum base price.
      if (lineItem.product_id === 0) {
        const itemPrice = Math.max(1000, Number(item.price) || 1000);
        const lineTotal = (itemPrice * lineItem.quantity).toString();
        lineItem.subtotal = lineTotal;
        lineItem.total = lineTotal;
      }

      return lineItem;
    });

    // Construct the WooCommerce order payload
    const orderPayload = {
      payment_method: "custom_redirect",
      payment_method_title: "WooCommerce Checkout Portal",
      set_paid: false,
      status: "pending",
      billing: {
        first_name: billing.firstName,
        last_name: billing.lastName,
        address_1: billing.address1,
        address_2: billing.address2 || "",
        city: billing.city,
        state: billing.state,
        postcode: billing.postcode,
        country: billing.country || "US",
        email: billing.email,
        phone: billing.phone,
      },
      shipping: {
        first_name: shipping.firstName || billing.firstName,
        last_name: shipping.lastName || billing.lastName,
        address_1: shipping.address1 || billing.address1,
        address_2: shipping.address2 || billing.address2 || "",
        city: shipping.city || billing.city,
        state: shipping.state || billing.state,
        postcode: shipping.postcode || billing.postcode,
        country: shipping.country || billing.country || "US",
      },
      line_items,
      // Add a note referencing the headless storefront
      customer_note: "Created via Yubby Dubby Headless Storefront",
    };

    console.log("Creating WooCommerce order via REST API...");
    
    const order: any = await fetchWooCommerce("orders", {
      method: "POST",
      body: JSON.stringify(orderPayload),
    });

    if (!order || !order.id) {
      throw new Error("WooCommerce order creation failed to return order ID.");
    }

    console.log(`Successfully created WooCommerce order ID: ${order.id}`);

    // Return the order details, specifically ID and key for Order Pay redirection
    const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://shop.yubbydubby.com";
    return NextResponse.json({
      orderId: order.id,
      orderKey: order.order_key,
      paymentUrl: `${baseUrl}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`,
    });
  } catch (error: any) {
    console.error("Error creating WooCommerce order:", error);
    return NextResponse.json(
      { 
        error: "Failed to process order checkout. Please check your details.", 
        details: error?.message || "" 
      },
      { status: 500 }
    );
  }
}
