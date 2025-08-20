"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
// Removed next-intl dependency

// Enhanced Brand Component with Logo
const NavbarBrand: React.FC<{ locale: string }> = ({ locale }) => {
  // Removed useTranslations - using hardcoded English

  const getLogoPath = (isDark: boolean = false): string => {
    return isDark
      ? "/assets/dreamtoapp/dreamToApp-dark.svg"
      : "/assets/dreamtoapp/dreamToApp.svg";
  };

  return (
    <Link
      href={`/${locale}`}
      className="flex items-center group transition-all duration-300 hover:scale-105"
      aria-label="DreamToApp Home"
    >
      <div className="relative">
        <Image
          src={getLogoPath(false)}
          alt="DreamToApp Logo"
          width={48}
          height={48}
          className="w-10 h-10 md:w-12 md:h-12 block dark:hidden transition-all duration-300 group-hover:rotate-3"
          priority
        />
        <Image
          src={getLogoPath(true)}
          alt="DreamToApp Logo"
          width={48}
          height={48}
          className="w-10 h-10 md:w-12 md:h-12 hidden dark:block transition-all duration-300 group-hover:rotate-3"
          priority
        />
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      </div>
    </Link>
  );
};

export default NavbarBrand; 