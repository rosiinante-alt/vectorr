# Polar Integration Setup

The Polar payments integration has been installed but needs configuration to work.

## What's Been Done

✅ Installed `@polar-sh/sdk` (API version 2026-10)  
✅ Created Polar SDK client at `src/lib/polar.ts`  
✅ Created checkout API route at `src/app/api/checkout/route.ts`  
✅ Created webhook handler at `src/app/api/polar/webhooks/route.ts`  
✅ Added environment variable placeholders in `.env.local`

## What You Need To Do

### 1. Create Organization Access Token

Go to https://polar.sh/dashboard/corazon-builds/settings

Click "Create token" or "Access Tokens" and create a new **Organization Access Token** with these scopes:

- `products:read`
- `products:write`
- `checkouts:read`
- `checkouts:write`
- `webhooks:read`
- `webhooks:write`

Copy the token.

### 2. Add Token to Environment

Open `/Users/rosinante/Projects/Vectorr/.env.local` and paste your token:

```bash
POLAR_ACCESS_TOKEN=polar_at_YOUR_TOKEN_HERE
```

### 3. Create Products in Polar

Before you can create checkouts, you need products with prices. Go to:
https://polar.sh/dashboard/corazon-builds/products

Create your products and note their **Product Price IDs** (not product IDs).

### 4. Set Up Webhooks (When You Deploy)

When you deploy your app, you'll need to configure webhooks:

1. Go to https://polar.sh/dashboard/corazon-builds/settings/webhooks
2. Click "Create webhook endpoint"
3. **URL**: `https://your-domain.com/api/polar/webhooks` (your deployed URL)
4. **Format**: Select "Simplified" or "Standard Webhooks"
5. **API Version**: 2026-10
6. **Events**: Select the events you want (at minimum: `checkout.updated`, `order.paid`)
7. Copy the **signing secret** and add it to `.env.local`:

```bash
POLAR_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

## How To Use

### Creating a Checkout

Make a POST request to `/api/checkout`:

```typescript
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productPriceId: 'price_xxxxx', // From your Polar dashboard
    successUrl: 'https://yoursite.com/success',
    customerEmail: 'user@example.com', // Optional
  }),
});

const { checkoutId, url } = await response.json();

// Redirect user to the checkout URL
window.location.href = url;
```

### Webhook Events

Your webhook handler at `/api/polar/webhooks` will receive events like:

- `checkout.created` - Checkout session started
- `checkout.updated` - Checkout session updated (check `status === "confirmed"`)
- `order.paid` - Payment successfully processed ✅ **Grant access here**
- `order.created` - Order created (might not be paid yet)
- `subscription.created` - Recurring subscription started
- `subscription.canceled` - Subscription canceled

**Important**: Grant user access on `order.paid`, not `checkout.updated`.

## Next Steps

1. Add your Polar access token to `.env.local`
2. Create products in your Polar dashboard
3. Update your pricing page to call `/api/checkout` with the correct product price IDs
4. Test locally with a test checkout
5. Deploy and configure webhooks with your production URL

## Testing Locally

To test webhooks locally before deploying:

1. Use a tunnel service like ngrok: `ngrok http 3000`
2. Use the ngrok URL in your webhook configuration: `https://xxxxx.ngrok.io/api/polar/webhooks`
3. Test a checkout and watch the webhook events arrive

## SDK Error Reference

If you see build errors about `productPriceId`, make sure you're using the correct field name from the Polar SDK's `CheckoutCreate` interface. Check the SDK version and API documentation at https://docs.polar.sh

## Organization Details

- **Organization**: corazon-builds
- **Organization ID**: cc3cbe8c-2507-4fe3-ac7d-293c1428401b
- **Environment**: production
- **API Base**: https://api.polar.sh
- **API Version**: 2026-10

## Support

- Polar Documentation: https://docs.polar.sh
- API Reference: https://api.polar.sh/docs
- Polar Dashboard: https://polar.sh/dashboard/corazon-builds
