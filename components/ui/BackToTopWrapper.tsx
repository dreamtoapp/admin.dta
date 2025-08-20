"use client";

import { useState, useEffect } from 'react';

const BackToTopWrapper: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      try {
        // Show button when user scrolls down more than 300px
        if (window.scrollY > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } catch (error) {
        console.warn('Error toggling back to top visibility:', error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', toggleVisibility);

      // Cleanup
      return () => window.removeEventListener('scroll', toggleVisibility);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={() => {
        try {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          console.warn('Error scrolling to top:', error);
          // Fallback to instant scroll
          window.scrollTo(0, 0);
        }
      }}
      className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 hover:scale-110 z-50"
      aria-label="Back to top"
    >
      <svg
        className="w-6 h-6 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default BackToTopWrapper; 