"use client"
import React, { useEffect, useState, useMemo } from 'react';
// Removed next-intl dependency
import HeroContent from './HeroContent';
import WaveBackground from './WaveBackground';
import HeroStyles from './HeroStyles';

interface HeroProps {
  className?: string;
}

const HeroSection: React.FC<HeroProps> = ({
  className = ""
}) => {
  const locale = 'en'; // Hardcoded for now
  // Removed useTranslations

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add playing class after component mounts to start animations
    // Use a timeout to ensure this runs after hydration
    const timer = setTimeout(() => {
      const card = document.querySelector('.e-card');
      if (card) {
        card.classList.add('playing');
      }
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Ensure consistent rendering between server and client
  const heroContent = useMemo(() => (
    <HeroContent
      logoAlt="DreamToApp Logo"
      tagline="Transform Your Ideas Into Reality"
      title="Dream To App"
      description="We turn your dreams into powerful, scalable applications. From concept to deployment, we handle everything with cutting-edge technology and expert development."
      ctaPrimary="Start Your Project"
      ctaSecondary="Learn More"
      slogan="Where Dreams Become Apps"
      locale={locale}
    />
  ), [locale]);

  return (
    <div className={`w-full min-h-screen bg-gradient-to-br from-blue-950 via-amber-900 to-cyan-900 dom-optimized ${className}`}>
      <HeroStyles />

      <div className="e-card card-optimized">
        <div className="image"></div>
        <WaveBackground />
        <div className="hero-content">
          {heroContent}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;