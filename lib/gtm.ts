declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

// Performance API type definitions
interface LargestContentfulPaintEntry extends PerformanceEntry {
  url?: string
  size: number
  id?: string
  element?: Element
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number
  processingEnd: number
  target?: Element
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
  lastInputTime: number
  sources?: Array<{
    node?: Node
    currentRect?: DOMRectReadOnly
    previousRect?: DOMRectReadOnly
  }>
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-P43DC5FM'

// Initialize dataLayer if it doesn't exist
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || []
}

// GTM pageview function - Updated for Next.js Script component
export const pageview = (url: string, locale?: string) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_location: url,
      page_title: document.title,
      page_language: locale || 'en',
      timestamp: Date.now()
    })
  }
}

// GTM event function - Updated for Next.js Script component
export const event = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  customParameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'custom_event',
      event_category: category,
      event_action: action,
      event_label: label,
      event_value: value,
      ...customParameters,
      timestamp: Date.now()
    })
  }
}

// Enhanced e-commerce tracking - Performance optimized
export const trackEcommerce = (data: {
  event: string
  ecommerce: Record<string, any>
}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data)
  }
}

// Core Web Vitals tracking - Re-enabled for analytics
export const trackCoreWebVitals = () => {
  if (typeof window === 'undefined') return

  // Track LCP
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1] as LargestContentfulPaintEntry
    if (lastEntry) {
      window.dataLayer?.push({
        event: 'core_web_vitals',
        metric_name: 'LCP',
        metric_value: Math.round(lastEntry.startTime),
        metric_id: lastEntry.id || 'unknown'
      })
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // Track FID
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry) => {
      const firstInputEntry = entry as FirstInputEntry
      if (firstInputEntry.processingStart && firstInputEntry.processingEnd) {
        const firstInputDelay = firstInputEntry.processingEnd - firstInputEntry.processingStart
        window.dataLayer?.push({
          event: 'core_web_vitals',
          metric_name: 'FID',
          metric_value: Math.round(firstInputDelay),
          metric_id: firstInputEntry.name || 'unknown'
        })
      }
    })
  }).observe({ entryTypes: ['first-input'] })

  // Track CLS
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry) => {
      const layoutShiftEntry = entry as LayoutShiftEntry
      if (!layoutShiftEntry.hadRecentInput) {
        window.dataLayer?.push({
          event: 'core_web_vitals',
          metric_name: 'CLS',
          metric_value: Math.round(layoutShiftEntry.value * 1000) / 1000,
          metric_id: layoutShiftEntry.name || 'unknown'
        })
      }
    })
  }).observe({ entryTypes: ['layout-shift'] })
}

// Performance monitoring - Lightweight version
export const monitorGTMPerformance = () => {
  if (typeof window === 'undefined') return

  // Monitor GTM load time only if needed
  const gtmLoadTime = performance.getEntriesByName('gtm.js')[0]
  if (gtmLoadTime && gtmLoadTime.duration > 1000) {
    console.warn('GTM load time exceeds 1 second threshold:', gtmLoadTime.duration)
  }
}

// Initialize GTM when user interacts with the page - Updated for Next.js Script
export const initializeGTMOnInteraction = () => {
  if (typeof window === 'undefined') return

  // GTM is now loaded via Next.js Script component, so we just need to track pageviews
  const trackPageview = () => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_location: window.location.href,
        page_title: document.title,
        timestamp: Date.now()
      })
    }
  }

  // Track initial pageview
  trackPageview()
}
