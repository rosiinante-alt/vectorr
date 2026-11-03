import { connection, type NextRequest } from "next/server";
import { polar, organizationId } from "@/lib/polar";
import { json, serverError } from "@/lib/http";

/**
 * GET /api/polar/orders
 * 
 * Retrieve orders for the organization.
 * 
 * Response:
 * {
 *   "items": [
 *     {
 *       "id": "order_xxxxx",
 *       "status": "paid",
 *       "customer_email": "user@example.com",
 *       "amount": 9999,
 *       "currency": "usd",
 *       "created_at": "2026-11-03T..."
 *     }
 *   ]
 * }
 */
export async function GET(req: NextRequest) {
  // Bails out of prerendering: this reads live Polar data at request time.
  await connection();

  try {
    const response = await polar.orders.list({
      organization_id: organizationId,
    });

    return json({
      items: response.items || [],
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return serverError(
      error instanceof Error ? error.message : "Failed to fetch orders"
    );
  }
}
