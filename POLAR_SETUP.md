# Polar Integration Setup Guide

Complete guide for Polar payments/billing integration in Vectorr.

## Overview

This integration provides:
- **Checkout API** (`POST /api/checkout`) - Create payment checkouts
- **Products API** (`GET /api/polar/products`) - Retrieve organization products
- **Orders API** (`GET /api/polar/orders`) - Retrieve and list orders
- **Webhooks** (`POST /api/polar/webhooks`) - Handle payment/subscription events

Organization: **corazon-builds** (`YOUR_ORG_ID_HERE`)

---

## Environment Configuration

All environment variables are in `.env.local`:

```
# Polar Configuration
POLAR_ACCESS_TOKEN=polar_oat_YOUR_ACCESS_TOKEN_HERE
POLAR_SERVER=production
POLAR_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

**Variables:**
- `POLAR_ACCESS_TOKEN` - Organization access token (OAuth token for corazon-builds org)
- `POLAR_SERVER` - Environment: `production` or `sandbox` (currently production)
- `POLAR_WEBHOOK_SECRET` - Webhook signing secret (obtained from Polar dashboard)

---

## API Endpoints

### 1. Create Checkout

**Endpoint:** `POST /api/checkout`

Creates a Polar checkout session for payment.

**Request Body:**
```json
{
  "productId": "prod_xxxxx",           // Required: Product ID from Polar
  "customerEmail": "user@example.com", // Optional: Pre-fill customer email
  "successUrl": "https://app.com/success", // Optional: Redirect after payment
  "metadata": {                        // Optional: Custom data (up to 50 key-value pairs)
    "userId": "user_123",
    "plan": "pro"
  }
}
```

**Response:**
```json
{
  "checkoutId": "checkout_xxxxx",
  "url": "https://checkout.polar.sh/...",
  "clientSecret": "cs_xxxxx"
}
```

**Example Usage:**
```typescript
const { url } = await fetch("/api/checkout", {
  method: "POST",
  body: JSON.stringify({
    productId: "prod_abc123",
    customerEmail: "user@example.com",
  }),
}).then(r => r.json());

window.location.href = url; // Redirect to checkout
```

---

### 2. List Products

**Endpoint:** `GET /api/polar/products`

Retrieve all products in the organization.

**Query Parameters:**
- `limit` - Number of results (default: 10, max: 100)
- `offset` - Offset for pagination (default: 0)

**Response:**
```json
{
  "items": [
    {
      "id": "prod_xxxxx",
      "name": "Product Name",
      "description": "Product description",
      "prices": [
        {
          "id": "price_xxxxx",
          "amount_decimal": "9999",
          "currency": "usd",
          "recurring": {
            "interval": "month",
            "interval_count": 1
          }
        }
      ]
    }
  ],
  "pagination": {
    "total_count": 5,
    "total_pages": 1
  }
}
```

**Example Usage:**
```typescript
const { items } = await fetch("/api/polar/products?limit=10").then(r => r.json());
items.forEach(product => {
  console.log(`${product.name}: ${product.description}`);
});
```

---

### 3. List Orders

**Endpoint:** `GET /api/polar/orders`

Retrieve orders for the organization.

**Query Parameters:**
- `limit` - Number of results (default: 10, max: 100)
- `offset` - Offset for pagination (default: 0)
- `status` - Filter by status: `pending`, `paid`, `canceled` (optional)

**Response:**
```json
{
  "items": [
    {
      "id": "order_xxxxx",
      "status": "paid",
      "customer_email": "user@example.com",
      "amount": 9999,
      "currency": "usd",
      "created_at": "2026-11-03T10:30:00Z",
      "product": {
        "id": "prod_xxxxx",
        "name": "Product Name"
      }
    }
  ],
  "pagination": {
    "total_count": 42,
    "total_pages": 5
  }
}
```

**Example Usage:**
```typescript
const { items } = await fetch("/api/polar/orders?status=paid&limit=20").then(r => r.json());
items.forEach(order => {
  console.log(`${order.customer_email}: $${order.amount/100}`);
});
```

---

### 4. Webhook Handler

**Endpoint:** `POST /api/polar/webhooks`

Receives and processes Polar webhook events.

**Events Handled:**

| Event | Payload | Use Case |
|-------|---------|----------|
| `checkout.created` | `id`, `status`, `product_ids` | Track checkout analytics |
| `checkout.updated` | `id`, `status`, `confirm_expires_at` | Payment confirmation, grant access when `status === "confirmed"` |
| `order.created` | `id`, `status`, `customer_email`, `total_amount` | Fulfill order, send receipt |
| `order.paid` | `id`, `status`, `customer_email` | Activate subscription/access |
| `subscription.created` | `id`, `status`, `customer_id` | Log subscription start |
| `subscription.updated` | `id`, `status`, `current_period_end` | Update user tier/permissions |
| `subscription.canceled` | `id`, `canceled_at`, `customer_id` | Revoke access, notify user |

**Event Structure:**
```json
{
  "type": "order.paid",
  "timestamp": "2026-11-03T10:30:00Z",
  "api_version": "2026-10",
  "data": {
    "id": "order_xxxxx",
    "status": "paid",
    "customer_email": "user@example.com",
    "total_amount": 9999,
    "currency": "usd"
  }
}
```

**Webhook Setup:**
1. Go to https://polar.sh/dashboard/corazon-builds/settings/webhooks
2. Create new webhook with URL: `https://vectorr.001746.xyz/api/polar/webhooks`
3. Set format to **Raw** and API version to **2026-10**
4. Copy the webhook secret from Polar dashboard
5. Add to `.env.local` as `POLAR_WEBHOOK_SECRET`

---

## Implementation Examples

### Example 1: Basic Checkout Flow

```typescript
import { useState } from "react";

export function CheckoutButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
      const { url } = await response.json();
      window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? "Loading..." : "Checkout"}
    </button>
  );
}
```

### Example 2: List Available Products

```typescript
import { useEffect, useState } from "react";

export function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/polar/products")
      .then(r => r.json())
      .then(data => setProducts(data.items));
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          {product.prices.map(price => (
            <div key={price.id}>
              ${price.amount_decimal / 100} {price.currency.toUpperCase()}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Handle Webhook Events in Your Code

The webhook handler at `/api/polar/webhooks/route.ts` already validates signatures and processes events. To add custom business logic:

```typescript
// In src/app/api/polar/webhooks/route.ts, update the switch cases:

case "order.paid":
  console.log("Order paid:", event.data.id);
  // Your business logic here:
  // - Grant user access to product
  // - Send confirmation email
  // - Update database
  // Example:
  // await grantUserAccess(event.data.customer_email);
  // await sendConfirmationEmail(event.data.customer_email);
  break;

case "subscription.canceled":
  console.log("Subscription canceled:", event.data.id);
  // Your business logic here:
  // - Revoke user access
  // - Send cancellation email
  // Example:
  // await revokeUserAccess(event.data.customer_id);
  break;
```

---

## Testing the Integration

### Local Testing

1. **Test Checkout Creation:**
   ```bash
   curl -X POST http://localhost:3000/api/checkout \
     -H "Content-Type: application/json" \
     -d '{
       "productId": "prod_xxxxx",
       "customerEmail": "test@example.com"
     }'
   ```

2. **Test Products API:**
   ```bash
   curl http://localhost:3000/api/polar/products
   ```

3. **Test Orders API:**
   ```bash
   curl http://localhost:3000/api/polar/orders
   ```

### Production Testing (After Deployment)

1. **Deploy to https://vectorr.001746.xyz**
   ```bash
   npm run build
   npm start
   ```

2. **Create webhook in Polar dashboard:**
   - URL: `https://vectorr.001746.xyz/api/polar/webhooks`
   - Format: Raw
   - API Version: 2026-10

3. **Test webhook delivery:**
   - Go to Polar dashboard → Webhooks settings
   - Click "Send test" to send a test event
   - Check server logs to confirm event received

4. **Test real checkout flow:**
   - Create a checkout in your app
   - Complete payment at Polar checkout
   - Verify webhook events arrive and are processed

---

## Troubleshooting

### "POLAR_WEBHOOK_SECRET not configured"
- The webhook handler is running but the secret is missing
- Add `POLAR_WEBHOOK_SECRET` to `.env.local`
- Obtain from Polar dashboard: https://polar.sh/dashboard/corazon-builds/settings/webhooks

### "Webhook signature validation failed"
- The webhook signature is invalid
- Verify `POLAR_WEBHOOK_SECRET` matches the one in Polar dashboard
- Check webhook format is set to "Raw" in Polar dashboard
- Check API version is "2026-10" in Polar dashboard

### "Product not found" or "Order not found"
- Verify product/order IDs are correct
- Check organization ID is correct: `cc3cbe8c-2507-4fe3-ac7d-293c1428401b`
- Confirm POLAR_ACCESS_TOKEN has permission to access the resource

### Checkout redirection not working
- Verify `productId` is valid
- Check error response from `/api/checkout`
- Look at server logs for detailed error messages

---

## Files Structure

```
src/
├── lib/
│   └── polar.ts                           # Polar SDK client initialization
├── app/
│   └── api/
│       ├── checkout/
│       │   └── route.ts                   # Checkout creation endpoint
│       └── polar/
│           ├── products/
│           │   └── route.ts               # Products listing endpoint
│           ├── orders/
│           │   └── route.ts               # Orders listing endpoint
│           ├── webhooks/
│           │   └── route.ts               # Webhook event handler
│           └── EXAMPLES.ts                # Usage examples & documentation
```

---

## SDK Documentation

Full Polar SDK documentation: https://docs.polar.sh

Key resources:
- [API Reference](https://docs.polar.sh/api)
- [Checkouts](https://docs.polar.sh/api/checkouts)
- [Orders](https://docs.polar.sh/api/orders)
- [Subscriptions](https://docs.polar.sh/api/subscriptions)
- [Webhooks](https://docs.polar.sh/webhooks)

---

## Support

For issues or questions:
1. Check server logs: `npm run dev` shows all API calls and webhook events
2. Verify environment variables are set correctly
3. Review Polar dashboard: https://polar.sh/dashboard/corazon-builds
4. Check Polar API status: https://status.polar.sh

---

**Last Updated:** November 3, 2026
**Integration Status:** ✅ Complete and Ready for Testing
