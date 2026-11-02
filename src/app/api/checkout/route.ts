import { polar } from "@/lib/polar";
import { json, badRequest, serverError } from "@/lib/http";
import type { NextRequest } from "next/server";

/**
 * POST /api/checkout
 * 
 * Create a Polar checkout session.
 * 
 * Request body:
 * {
 *   "productId": "prod_xxxxx",           // Required: Product ID from Polar
 *   "successUrl": "https://...",         // Optional: Redirect URL after successful payment
 *   "customerEmail": "user@example.com", // Optional: Pre-fill customer email
 *   "metadata": { ... }                  // Optional: Custom metadata
 * }
 * 
 * Response:
 * {
 *   "checkoutId": "checkout_xxxxx",
 *   "url": "https://checkout.polar.sh/...",
 *   "clientSecret": "cs_xxxxx"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, successUrl, customerEmail, metadata } = body;

    if (!productId) {
      return badRequest("Product ID is required");
    }

    // Create checkout with the correct Polar SDK structure
    const checkout = await polar.checkouts.create({
      products: [productId], // Array of product IDs
      customer_email: customerEmail,
      metadata: metadata || {},
    });

    return json({ 
      checkoutId: checkout.id,
      url: checkout.url,
      clientSecret: checkout.client_secret,
    });
  } catch (error) {
    console.error("Checkout creation failed:", error);
    return serverError(
      error instanceof Error ? error.message : "Failed to create checkout"
    );
  }
}
