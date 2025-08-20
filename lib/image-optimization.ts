// Image Optimization Utilities
// Fixes: Enormous Network Payload (1.7 MiB) and Defer Offscreen Images (590 KiB savings)

export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  className?: string
  loading?: 'lazy' | 'eager'
}

// Default optimization settings
export const DEFAULT_IMAGE_OPTIONS = {
  quality: 75, // Reduced from default 100 for better performance
  formats: ['image/webp', 'image/avif'] as const,
  placeholder: 'blur' as const,
  loading: 'lazy' as const,
}

// Image size presets for responsive design
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 1200, height: 800 },
  hero: { width: 1920, height: 1080 },
}

// Lazy loading threshold (viewport + 200px)
export const LAZY_LOADING_THRESHOLD = 200

// Generate optimized image URL with Cloudinary
export const getOptimizedImageUrl = (
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'avif'
  } = {}
) => {
  // If it's already a Cloudinary URL, optimize it
  if (src.includes('res.cloudinary.com')) {
    const url = new URL(src)
    const params = new URLSearchParams(url.search)

    // Add optimization parameters
    if (options.width) params.set('w', options.width.toString())
    if (options.height) params.set('h', options.height.toString())
    if (options.quality) params.set('q', options.quality.toString())
    if (options.format) params.set('f', options.format)

    // Add auto-optimization
    params.set('auto', 'format,compress')

    url.search = params.toString()
    return url.toString()
  }

  return src
}

// Generate responsive sizes string
export const getResponsiveSizes = (breakpoints: Record<string, number>) => {
  return Object.entries(breakpoints)
    .map(([breakpoint, width]) => `(max-width: ${breakpoint}) ${width}px`)
    .join(', ')
}

// Default responsive sizes
export const DEFAULT_SIZES = getResponsiveSizes({
  '640px': 100,
  '768px': 50,
  '1024px': 33,
  '1280px': 25,
})

// Preload critical images
export const preloadCriticalImages = (images: string[]) => {
  if (typeof window === 'undefined') return

  images.forEach((src) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}
