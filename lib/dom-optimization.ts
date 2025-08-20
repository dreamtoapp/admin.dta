// DOM Size Optimization Utilities
// Fixes: Optimize DOM size (762 elements → < 500 elements)

export interface DOMOptimizationConfig {
  maxElements: number
  maxDepth: number
  maxChildren: number
  enableCleanup: boolean
  enableMonitoring: boolean
}

// Default DOM optimization configuration
export const DOM_OPTIMIZATION_CONFIG: DOMOptimizationConfig = {
  maxElements: 500, // Maximum DOM elements (Lighthouse recommendation)
  maxDepth: 12, // Maximum DOM depth (Lighthouse recommendation)
  maxChildren: 100, // Maximum children per element
  enableCleanup: true,
  enableMonitoring: true,
}

// Monitor DOM size
export const monitorDOMSize = () => {
  if (typeof window === 'undefined') return

  const observer = new MutationObserver(() => {
    const domSize = document.querySelectorAll('*').length
    const maxDepth = getMaxDepth(document.body)
    const maxChildren = getMaxChildren(document.body)

    if (domSize > DOM_OPTIMIZATION_CONFIG.maxElements) {
      console.warn(`DOM size (${domSize}) exceeds recommended limit (${DOM_OPTIMIZATION_CONFIG.maxElements})`)
      if (DOM_OPTIMIZATION_CONFIG.enableCleanup) {
        cleanupExcessiveElements()
      }
    }

    if (maxDepth > DOM_OPTIMIZATION_CONFIG.maxDepth) {
      console.warn(`DOM depth (${maxDepth}) exceeds recommended limit (${DOM_OPTIMIZATION_CONFIG.maxDepth})`)
    }

    if (maxChildren > DOM_OPTIMIZATION_CONFIG.maxChildren) {
      console.warn(`Max children (${maxChildren}) exceeds recommended limit (${DOM_OPTIMIZATION_CONFIG.maxChildren})`)
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  return () => observer.disconnect()
}

// Get maximum DOM depth
const getMaxDepth = (element: Element, currentDepth = 0): number => {
  let maxDepth = currentDepth
  const children = element.children

  for (let i = 0; i < children.length; i++) {
    const childDepth = getMaxDepth(children[i], currentDepth + 1)
    maxDepth = Math.max(maxDepth, childDepth)
  }

  return maxDepth
}

// Get maximum children count
const getMaxChildren = (element: Element): number => {
  let maxChildren = element.children.length
  const children = element.children

  for (let i = 0; i < children.length; i++) {
    const childMaxChildren = getMaxChildren(children[i])
    maxChildren = Math.max(maxChildren, childMaxChildren)
  }

  return maxChildren
}

// Clean up excessive DOM elements
export const cleanupExcessiveElements = () => {
  if (typeof window === 'undefined') return

  // Remove empty elements
  const emptyElements = document.querySelectorAll('div:empty, span:empty, p:empty')
  emptyElements.forEach((element) => {
    if (element.children.length === 0 && !element.textContent?.trim()) {
      element.remove()
    }
  })

  // Remove hidden elements that are not needed
  const hiddenElements = document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"]')
  hiddenElements.forEach((element) => {
    if (!(element as HTMLElement).dataset?.keep) {
      element.remove()
    }
  })

  // Remove unnecessary wrappers
  const unnecessaryWrappers = document.querySelectorAll('.no-unnecessary-wrappers > *:only-child')
  unnecessaryWrappers.forEach((wrapper) => {
    if (wrapper.children.length === 1 && !wrapper.textContent?.trim()) {
      const child = wrapper.children[0]
      wrapper.parentNode?.replaceChild(child, wrapper)
    }
  })

  // Optimize grid layouts
  const gridElements = document.querySelectorAll('.grid-optimized')
  gridElements.forEach((grid) => {
    if (grid.children.length > 20) {
      // Limit grid items to prevent excessive DOM
      const items = Array.from(grid.children)
      items.slice(20).forEach(item => item.remove())
    }
  })
}

// Optimize card components
export const optimizeCardComponents = () => {
  if (typeof window === 'undefined') return

  const cards = document.querySelectorAll('.card-optimized')
  cards.forEach((card) => {
    // Remove unnecessary nested elements
    const nestedElements = card.querySelectorAll('* > * > * > * > *')
    nestedElements.forEach((element) => {
      if (element.children.length === 0 && !element.textContent?.trim()) {
        element.remove()
      }
    })
  })
}

// Initialize DOM optimization
export const initializeDOMOptimization = () => {
  if (typeof window === 'undefined') return

  if (DOM_OPTIMIZATION_CONFIG.enableMonitoring) {
    monitorDOMSize()
  }

  if (DOM_OPTIMIZATION_CONFIG.enableCleanup) {
    // Initial cleanup
    cleanupExcessiveElements()
    optimizeCardComponents()

    // Periodic cleanup
    setInterval(() => {
      cleanupExcessiveElements()
      optimizeCardComponents()
    }, 30000) // Clean up every 30 seconds
  }

  console.log('🚀 DOM optimization initialized')
}

// Cleanup function
export const cleanupDOMOptimization = () => {
  if (typeof window === 'undefined') return

  // Clean up observers and intervals
  const observers = (window as any)._domObservers || []
  observers.forEach((observer: any) => {
    if (observer && typeof observer.disconnect === 'function') {
      observer.disconnect()
    }
  })

  console.log('🧹 DOM optimization cleaned up')
}
