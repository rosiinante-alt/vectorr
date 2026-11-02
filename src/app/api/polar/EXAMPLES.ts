/**
 * Polar Integration Example Usage
 * 
 * This file shows how to use the Polar API routes in your application.
 */

// ============================================================================
// 1. CREATE A CHECKOUT
// ============================================================================

export async function createCheckout(productId: string, userEmail: string) {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId,
      customerEmail: userEmail,
      successUrl: `${window.location.origin}/success`,
      metadata: {
        userId: "user_123", // Your internal user ID
        plan: "pro",
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout");
  }

  const { checkoutId, url, clientSecret } = await response.json();
  return { checkoutId, url, clientSecret };
}

// Usage:
// try {
//   const { url } = await createCheckout("prod_abc123", "user@example.com");
//   window.location.href = url; // Redirect to Polar checkout
// } catch (error) {
//   console.error("Checkout error:", error);
// }

// ============================================================================
// 2. FETCH ALL PRODUCTS
// ============================================================================

export async function fetchProducts(limit = 10, offset = 0) {
  const response = await fetch(
    `/api/polar/products?limit=${limit}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return await response.json();
}

// Usage:
// const { items, pagination } = await fetchProducts();
// items.forEach(product => {
//   console.log(`${product.name}: ${product.description}`);
// });

// ============================================================================
// 3. FETCH ORDERS
// ============================================================================

export async function fetchOrders(
  limit = 10,
  offset = 0,
  status?: "pending" | "paid" | "canceled"
) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (status) params.append("status", status);

  const response = await fetch(`/api/polar/orders?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return await response.json();
}

// Usage:
// const { items } = await fetchOrders(10, 0, "paid");
// items.forEach(order => {
//   console.log(`Order ${order.id}: ${order.customer_email} - $${order.amount/100}`);
// });

// ============================================================================
// 4. REACT COMPONENT EXAMPLE
// ============================================================================

/*
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CheckoutButton({ productId, email }: { productId: string; email: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    try {
      setLoading(true);
      setError("");
      const { url } = await createCheckout(productId, email);
      router.push(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Loading..." : "Checkout"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
*/

// ============================================================================
// 5. WEBHOOK EVENT TYPES
// ============================================================================

/*
The webhook handler at /api/polar/webhooks processes these events:

checkout.created
  - Fired when a checkout is created
  - Use: track checkout creation analytics

checkout.updated
  - Fired when checkout status changes
  - status === "confirmed" means payment was successful
  - Use: grant user access, send confirmation email

order.created
  - Fired when an order is created
  - Use: fulfill order, send receipt

order.paid
  - Fired when order payment is confirmed
  - Use: activate subscription, grant access

subscription.created
  - Fired when a subscription is created
  - Use: log subscription start

subscription.updated
  - Fired when subscription properties change
  - Use: update user tier/permissions

subscription.canceled
  - Fired when subscription is canceled
  - Use: revoke access, notify user

All webhook events include:
- type: "checkout.created", "order.paid", etc.
- timestamp: ISO 8601 timestamp
- data: the full object (checkout, order, subscription, etc.)
*/

// ============================================================================
// 6. ENVIRONMENT VARIABLES REQUIRED
// ============================================================================

/*
# In .env.local:

POLAR_ACCESS_TOKEN=polar_oat_xxxxx
POLAR_SERVER=production
POLAR_WEBHOOK_SECRET=whsec_xxxxx

The POLAR_WEBHOOK_SECRET is obtained from:
  https://polar.sh/dashboard/corazon-builds/settings/webhooks
  
  After creating a webhook with URL:
  https://vectorr.001746.xyz/api/polar/webhooks
  
  Copy the webhook secret and add it to .env.local
*/

// ============================================================================
// 7. TESTING THE INTEGRATION
// ============================================================================

/*
To test locally before deployment:

1. Create a checkout via POST /api/checkout
   curl -X POST http://localhost:3000/api/checkout \
     -H "Content-Type: application/json" \
     -d '{"productId":"prod_xxx","customerEmail":"test@example.com"}'

2. Check products via GET /api/polar/products
   curl http://localhost:3000/api/polar/products

3. Check orders via GET /api/polar/orders
   curl http://localhost:3000/api/polar/orders

Once deployed to https://vectorr.001746.xyz:

4. Create webhook in Polar dashboard pointing to:
   https://vectorr.001746.xyz/api/polar/webhooks

5. Test webhook delivery from Polar dashboard
   (sends test events to your webhook endpoint)
*/
