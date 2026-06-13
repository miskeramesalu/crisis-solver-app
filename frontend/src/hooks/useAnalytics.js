// frontend/src/hooks/useAnalytics.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Analytics service – replace with your actual provider (e.g., Google Analytics, Plausible)
const analytics = {
  trackPageView: (path) => {
    // Example: window.gtag('config', 'GA_MEASUREMENT_ID', { page_path: path });
    console.log(`[Analytics] Page view: ${path}`);
  },
  trackEvent: (category, action, label, value) => {
    // Example: window.gtag('event', action, { event_category: category, event_label: label, value });
    console.log(`[Analytics] Event: ${category} / ${action} / ${label} / ${value}`);
  },
};

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    analytics.trackPageView(location.pathname + location.search);
  }, [location]);

  // Return public methods for tracking custom events
  return {
    trackEvent: analytics.trackEvent,
    trackPageView: analytics.trackPageView,
  };
};

export default useAnalytics;