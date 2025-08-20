'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { pageview, trackCoreWebVitals } from '@/lib/gtm'

interface GTMProviderProps {
  children: React.ReactNode
  locale: string
}

export function GTMProvider({ children, locale }: GTMProviderProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views with performance optimization
    const trackPageview = () => {
      try {
        pageview(pathname, locale)

        // Log in development mode
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 GTM Pageview tracked:', pathname, locale)
        }
      } catch (error) {
        // Silent error handling for performance
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to track pageview:', error)
        }
      }
    }

    trackPageview()
  }, [pathname, locale])

  useEffect(() => {
    // Initialize Core Web Vitals tracking
    if (typeof window !== 'undefined') {
      trackCoreWebVitals()
    }
  }, [])

  return <>{children}</>
}
