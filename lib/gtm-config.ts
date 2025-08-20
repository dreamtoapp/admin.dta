// GTM Performance Configuration
// Based on official Google Tag Manager performance best practices

export const GTM_CONFIG = {
  // Performance-optimized settings
  loadStrategy: 'nextjsScript' as const, // Updated to use Next.js Script component
  interactionDelay: 5000, // 5 seconds
  maxLoadTime: 1000, // 1 second threshold
  enablePerformanceMonitoring: process.env.NODE_ENV === 'development', // Enabled in dev for testing
  enableCoreWebVitals: true, // Re-enabled for analytics

  // Resource optimization
  preconnectDomains: [
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ],

  // Error handling
  gracefulFallback: true,
  silentErrors: process.env.NODE_ENV === 'production', // Silent only in production

  // DataLayer optimization
  maxDataLayerSize: 50,
  cleanupInterval: 30000, // 30 seconds
}

// Performance monitoring utilities
export const monitorPerformance = () => {
  if (typeof window === 'undefined') return

  // Monitor GTM load time
  const gtmLoadTime = performance.getEntriesByName('gtm.js')[0]
  if (gtmLoadTime && gtmLoadTime.duration > GTM_CONFIG.maxLoadTime) {
    console.warn(`GTM load time (${gtmLoadTime.duration}ms) exceeds threshold (${GTM_CONFIG.maxLoadTime}ms)`)
  }

  // Monitor dataLayer size
  if (window.dataLayer && window.dataLayer.length > GTM_CONFIG.maxDataLayerSize) {
    console.warn(`DataLayer size (${window.dataLayer.length}) exceeds recommended limit (${GTM_CONFIG.maxDataLayerSize})`)
  }
}

// Cleanup dataLayer to prevent memory leaks
export const cleanupDataLayer = () => {
  if (typeof window === 'undefined' || !window.dataLayer) return

  // Keep only the last 50 entries
  if (window.dataLayer.length > GTM_CONFIG.maxDataLayerSize) {
    window.dataLayer = window.dataLayer.slice(-GTM_CONFIG.maxDataLayerSize)
  }
}

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  if (typeof window === 'undefined') return

  // Only monitor in development mode for testing
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 GTM Performance monitoring enabled in development mode')

    // Monitor performance every 30 seconds
    setInterval(() => {
      monitorPerformance()
      cleanupDataLayer()
    }, GTM_CONFIG.cleanupInterval)
  }
}

// Development testing utilities
export const testGTMPerformance = () => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return

  console.log('🧪 Testing GTM Performance...')

  // Test dataLayer
  if (window.dataLayer) {
    console.log('✅ DataLayer initialized:', window.dataLayer.length, 'entries')
  } else {
    console.log('⚠️ DataLayer not yet initialized')
  }

  // Test GTM load time
  const gtmLoadTime = performance.getEntriesByName('gtm.js')[0]
  if (gtmLoadTime) {
    console.log('✅ GTM load time:', gtmLoadTime.duration.toFixed(2), 'ms')
  } else {
    console.log('⚠️ GTM not yet loaded')
  }

  // Test resource hints
  const preconnectLinks = document.querySelectorAll('link[rel="preconnect"]')
  console.log('✅ Resource hints found:', preconnectLinks.length, 'preconnect links')
}
