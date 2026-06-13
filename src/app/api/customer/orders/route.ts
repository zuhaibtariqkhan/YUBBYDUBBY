import { NextRequest, NextResponse } from "next/server";
import { fetchWooCommerce } from "@/lib/woocommerce";
import { getAuthenticatedUserId } from "@/lib/auth-helper";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Access denied. Valid login token is required." },
        { status: 401 }
      );
    }

    console.log(`Fetching orders for WooCommerce Customer ID: ${userId}...`);

    // Fetch the customer's orders from WooCommerce securely using the Admin client
    const rawOrders: any = await fetchWooCommerce(`orders?customer=${userId}&per_page=50`);

    if (!Array.isArray(rawOrders)) {
      return NextResponse.json([]);
    }

    // Map WooCommerce orders to the frontend dashboard's simplified structure
    const formattedOrders = rawOrders.map((order: any) => {
      // Format date (e.g. "June 09, 2026")
      const dateObj = new Date(order.date_created);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
      const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      // Determine order milestone state
      const wcStatus = order.status; // pending, processing, on-hold, completed, cancelled, refunded, failed
      let displayStatus = "Processing";
      let isPlaced = true;
      let isPacked = false;
      let isShipped = false;
      let isOutForDelivery = false;
      let isDelivered = false;

      if (wcStatus === "processing") {
        displayStatus = "Packed";
        isPacked = true;
      } else if (wcStatus === "completed") {
        displayStatus = "Delivered";
        isPacked = true;
        isShipped = true;
        isOutForDelivery = true;
        isDelivered = true;
      } else if (wcStatus === "cancelled" || wcStatus === "failed" || wcStatus === "refunded") {
        displayStatus = wcStatus.charAt(0).toUpperCase() + wcStatus.slice(1);
      } else {
        // pending, on-hold
        displayStatus = "Processing";
      }

      // Look for custom tracking number in metadata or notes, fallback to dummy
      const trackingMeta = order.meta_data?.find((meta: any) => meta.key === "_tracking_number" || meta.key === "tracking_number");
      const trackingNumber = trackingMeta ? trackingMeta.value : "Pending Fulfillment";

      // Map line items
      const items = order.line_items.map((item: any) => {
        const sizeMeta = item.meta_data?.find((meta: any) => meta.key.toLowerCase() === "size");
        return {
          name: item.name,
          qty: item.quantity,
          size: sizeMeta ? sizeMeta.value : "M",
          price: parseFloat(item.price),
          image: item.image?.src || "/prod-hoodie.png", // fallback placeholder if no image exists
        };
      });

      return {
        id: `YD-${order.id}`,
        dbId: order.id,
        date: formattedDate,
        total: parseFloat(order.total),
        status: displayStatus,
        tracking: trackingNumber,
        paymentStatus: `Paid via ${order.payment_method_title || "Gatekeeper Portal"}`,
        timeline: [
          { label: "Order Placed", date: `${formattedDate} ${formattedTime}`, done: isPlaced },
          { label: "Order Packed", date: isPacked ? `${formattedDate} 10:00` : "Pending", done: isPacked },
          { label: "Shipped", date: isShipped ? `${formattedDate} 15:30` : "Pending", done: isShipped },
          { label: "Out For Delivery", date: "Pending", done: isOutForDelivery },
          { label: "Delivered", date: "Pending", done: isDelivered },
        ],
        items,
      };
    });

    return NextResponse.json(formattedOrders);
  } catch (error: any) {
    console.error("GET Customer Orders Error:", error);
    return NextResponse.json(
      { error: "Failed to load order history. Please try again." },
      { status: 500 }
    );
  }
}
