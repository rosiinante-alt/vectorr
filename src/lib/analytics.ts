// Analytics tracking events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, properties || {});
  }

  // Posthog (optional, for product analytics)
  if ((window as any).posthog) {
    (window as any).posthog.capture(eventName, properties || {});
  }
};

// Page view tracking
export const trackPageView = (pageName: string) => {
  trackEvent('page_view', { page_name: pageName });
};

// Conversion tracking
export const trackConversion = (conversionType: string, value?: number) => {
  trackEvent(`conversion_${conversionType}`, {
    conversion_type: conversionType,
    value: value,
    timestamp: new Date().toISOString(),
  });
};

// Feature usage tracking
export const trackFeatureUsage = (feature: string, action: string) => {
  trackEvent('feature_usage', {
    feature,
    action,
  });
};

// Common events
export const trackEvents = {
  sliderUsed: () => trackFeatureUsage('slider', 'interact'),
  uploadStarted: () => trackFeatureUsage('upload', 'start'),
  formatSelected: (format: string) => trackFeatureUsage('format_select', format),
  convertClicked: () => trackConversion('convert_clicked'),
  signupClicked: () => trackConversion('signup_clicked'),
  pricingViewed: () => trackPageView('pricing'),
  blogViewed: (slug: string) => trackPageView(`blog_${slug}`),
  comparisonViewed: (competitor: string) => trackPageView(`comparison_${competitor}`),
};
