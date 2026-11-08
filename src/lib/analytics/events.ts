/**
 * GA4 Event Tracking
 * 
 * Usage:
 * import { trackEvent } from '@/lib/analytics/events'
 * trackEvent('tier_clicked', { tier_name: 'plus_monthly', tier_price: 9.99 })
 */

type EventName = 
  | 'view_pricing'
  | 'tier_clicked'
  | 'begin_checkout'
  | 'purchase'
  | 'checkout_abandoned'
  | 'conversion_success'
  | 'conversion_error'

interface EventParams {
  [key: string]: string | number | boolean | undefined
}

/**
 * Track a GA4 event
 * Safe to call on client or server (checks for window.gtag)
 */
export function trackEvent(eventName: EventName, params?: EventParams) {
  if (typeof window === 'undefined') return
  
  if (window.gtag) {
    window.gtag('event', eventName, params || {})
  }
}

/**
 * Track pricing page view
 */
export function trackPricingView() {
  trackEvent('view_pricing', {
    page_title: 'Pricing',
  })
}

/**
 * Track tier card click
 */
export function trackTierClicked(tierName: string, tierPrice: number) {
  trackEvent('tier_clicked', {
    tier_name: tierName,
    tier_price: tierPrice,
  })
}

/**
 * Track checkout initiated
 */
export function trackBeginCheckout(tierName: string, amount: number) {
  trackEvent('begin_checkout', {
    currency: 'USD',
    value: amount,
    tier_name: tierName,
  })
}

/**
 * Track purchase completed (call from webhook or success page)
 */
export function trackPurchase(
  transactionId: string,
  tierName: string,
  amount: number,
) {
  trackEvent('purchase', {
    transaction_id: transactionId,
    currency: 'USD',
    value: amount,
    tier_name: tierName,
  })
}

/**
 * Track checkout abandoned
 */
export function trackCheckoutAbandoned(tierName?: string) {
  trackEvent('checkout_abandoned', {
    tier_name: tierName || 'unknown',
  })
}

/**
 * Track conversion (file upload → result)
 */
export function trackConversionSuccess(
  fileFormat: string,
  creditsCost: number,
  savedBytes: number,
) {
  trackEvent('conversion_success', {
    file_format: fileFormat,
    credits_cost: creditsCost,
    saved_bytes: savedBytes,
  })
}

/**
 * Track conversion error
 */
export function trackConversionError(errorMessage: string) {
  trackEvent('conversion_error', {
    error_message: errorMessage,
  })
}

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: EventParams) => void
  }
}
