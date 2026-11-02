import { validateEvent } from "@/lib/polar";
import { json, badRequest, serverError } from "@/lib/http";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("webhook-signature");

    if (!signature) {
      return badRequest("Missing webhook signature");
    }

    if (!process.env.POLAR_WEBHOOK_SECRET) {
      console.error("POLAR_WEBHOOK_SECRET not configured");
      return serverError("Webhook secret not configured");
    }

    // Validate webhook signature
    const event = await validateEvent(
      body,
      { "webhook-signature": signature },
      process.env.POLAR_WEBHOOK_SECRET
    );

    console.log("Received Polar webhook:", event.type);

    // Handle different event types
    switch (event.type) {
      case "checkout.created":
        console.log("Checkout created:", event.data.id);
        break;

      case "checkout.updated":
        console.log("Checkout updated:", event.data.id);
        if (event.data.status === "confirmed") {
          console.log("Payment confirmed for checkout:", event.data.id);
          // TODO: Grant access to user, update database, etc.
        }
        break;

      case "order.created":
        console.log("Order created:", event.data.id);
        // TODO: Fulfill order, send confirmation email, etc.
        break;

      case "order.paid":
        console.log("Order paid:", event.data.id);
        // TODO: Grant access to user
        break;

      case "subscription.created":
        console.log("Subscription created:", event.data.id);
        break;

      case "subscription.updated":
        console.log("Subscription updated:", event.data.id);
        break;

      case "subscription.canceled":
        console.log("Subscription canceled:", event.data.id);
        // TODO: Revoke access
        break;

      default:
        console.log("Unhandled event type:", event.type);
    }

    return json({ received: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return badRequest(
      error instanceof Error ? error.message : "Webhook processing failed"
    );
  }
}
