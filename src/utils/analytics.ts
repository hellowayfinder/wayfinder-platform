// Extend Window to acknowledge gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function trackEvent(eventName: string, params: Record<string, string | number> = {}): void {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export const analytics = {
  providerViewed: (providerId: string, providerName: string) =>
    trackEvent('provider_viewed', { provider_id: providerId, provider_name: providerName }),

  contactTapped: (providerId: string, providerName: string) =>
    trackEvent('contact_tapped', { provider_id: providerId, provider_name: providerName }),

  mapsTapped: (providerId: string, providerName: string) =>
    trackEvent('maps_tapped', { provider_id: providerId, provider_name: providerName }),

  searchUsed: (query: string) =>
    trackEvent('search_used', { query }),

  serviceFiltered: (service: string) =>
    trackEvent('service_filtered', { service }),

  localityFiltered: (locality: string) =>
    trackEvent('locality_filtered', { locality }),

  feedbackOpened: () =>
    trackEvent('feedback_opened'),
};