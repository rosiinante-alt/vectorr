import { connection, type NextRequest } from "next/server";
import { polar, organizationId } from "@/lib/polar";
import { json, serverError } from "@/lib/http";

/**
 * GET /api/polar/products
 * 
 * Retrieve all products for the organization.
 * 
 * Response:
 * {
 *   "items": [
 *     {
 *       "id": "prod_xxxxx",
 *       "name": "Product Name",
 *       "description": "...",
 *       "prices": [ ... ]
 *     }
 *   ]
 * }
 */
export async function GET(req: NextRequest) {
  // Bails out of prerendering: this reads live Polar data at request time.
  await connection();

  try {
    const response = await polar.products.list({
      organization_id: organizationId,
    });

    return json({
      items: response.items || [],
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return serverError(
      error instanceof Error ? error.message : "Failed to fetch products"
    );
  }
}
