'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { getOptimizedImageUrl, DEFAULT_IMAGE_OPTIONS, IMAGE_SIZES } from '@/lib/image-optimization'

interface OptimizedImageProps {
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
  fill?: boolean
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = DEFAULT_IMAGE_OPTIONS.quality,
  placeholder = DEFAULT_IMAGE_OPTIONS.placeholder,
  blurDataURL,
  sizes,
  className,
  loading = DEFAULT_IMAGE_OPTIONS.loading,
  fill = false,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)

  // Optimize image URL
  const optimizedSrc = getOptimizedImageUrl(src, {
    width: width || IMAGE_SIZES.medium.width,
    height: height || IMAGE_SIZES.medium.height,
    quality,
    format: 'auto',
  })

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px', // Start loading 200px before entering viewport
      }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [priority])

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true)
    setHasError(false)
    onLoad?.()
  }

  // Handle image error
  const handleError = () => {
    setHasError(true)
    setIsLoaded(false)
    onError?.()
  }

  // Don't render if not in view and not priority
  if (!isInView && !priority) {
    return (
      <div
        ref={imgRef}
        className={`bg-muted animate-pulse ${className || ''}`}
        style={{
          width: width || '100%',
          height: height || '200px',
        }}
        aria-label={alt}
      />
    )
  }

  // Error state
  if (hasError) {
    return (
      <div
        className={`bg-muted flex items-center justify-center ${className || ''}`}
        style={{
          width: width || '100%',
          height: height || '200px',
        }}
        aria-label={`Error loading image: ${alt}`}
      >
        <div className="text-muted-foreground text-sm">Failed to load image</div>
      </div>
    )
  }

  return (
    <div ref={imgRef} className={`relative ${className || ''}`}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Optimized Image */}
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes || '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'}
        loading={loading}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className || ''}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
