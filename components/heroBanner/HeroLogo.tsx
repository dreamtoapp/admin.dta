"use client"
import React from 'react';
import Image from 'next/image';

interface HeroLogoProps {
  logoAlt: string;
  locale: string;
}

const HeroLogo: React.FC<HeroLogoProps> = ({ logoAlt, locale }) => {
  return (
    <div className="flex justify-center items-center w-full mb-2 md:mb-3">
      <div className="relative group">
        <Image
          src="/assets/dreamtoapp/dreamToApp.svg"
          alt={logoAlt}
          width={200}
          height={87}
          className="w-32 h-14 md:w-40 md:h-16 lg:w-48 lg:h-20 xl:w-56 xl:h-24 transition-all duration-300 group-hover:rotate-3 dark:invert dark:brightness-0 dark:contrast-200"
          priority
        />
      </div>
    </div>
  );
};

export default HeroLogo; 