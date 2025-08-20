"use client"
import React from 'react';
import HeroLogo from './HeroLogo';
import HeroText from './HeroText';
import HeroCTA from './HeroCTA';

interface HeroContentProps {
  logoAlt: string;
  tagline: string;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  slogan: string;
  locale: string;
}

const HeroContent: React.FC<HeroContentProps> = ({
  logoAlt,
  tagline,
  title,
  description,
  ctaPrimary,
  ctaSecondary,
  slogan,
  locale
}) => {
  return (
    <div className="infotop dom-optimized">
      <HeroLogo logoAlt={logoAlt} locale={locale} />
      <HeroText tagline={tagline} title={title} description={description} slogan={slogan} />
      <HeroCTA ctaPrimary={ctaPrimary} ctaSecondary={ctaSecondary} locale={locale} />
    </div>
  );
};

export default HeroContent; 