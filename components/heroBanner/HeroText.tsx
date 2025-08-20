"use client"
import React from 'react';

interface HeroTextProps {
  tagline: string;
  title: string;
  description: string;
  slogan: string;
}

// Tagline Component
const HeroTagline: React.FC<{ tagline: string }> = ({ tagline }) => (
  <div className="text-sm md:text-base lg:text-lg mb-1 md:mb-2 opacity-80 font-medium tracking-wide text-center">
    {tagline}
  </div>
);

// Main Tagline Component
const MainTagline: React.FC<{ slogan: string }> = ({ slogan }) => (
  <div className="text-lg md:text-xl lg:text-2xl mb-2 md:mb-3 opacity-95 font-semibold tracking-wider">
    {slogan}
  </div>
);

// Title Component
const HeroTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 md:mb-3 leading-tight tracking-tight max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto layout-stable prevent-layout-shift" style={{ minHeight: '4rem', contain: 'layout' }}>
    {title}
  </div>
);

// Description Component
const HeroDescription: React.FC<{ description: string }> = ({ description }) => (
  <div className="text-sm md:text-base lg:text-lg xl:text-xl mb-4 md:mb-6 opacity-90 leading-relaxed max-w-xs md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
    {description}
  </div>
);

const HeroText: React.FC<HeroTextProps> = ({ tagline, title, description, slogan }) => {
  return (
    <div className="dom-optimized">
      <MainTagline slogan={slogan} />
      <HeroTitle title={title} />
      <HeroTagline tagline={tagline} />
      <HeroDescription description={description} />
    </div>
  );
};

export default HeroText;
export { HeroTagline, MainTagline, HeroTitle, HeroDescription }; 