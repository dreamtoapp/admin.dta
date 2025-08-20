"use client";

import React from "react";
// Removed next-intl dependency
import NavbarBrand from "./NavbarBrand";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import NavbarActions from "./NavbarActions";
import CTAButton from "./CTAButton";

// Main Enhanced Navbar Component
const Navbar: React.FC<{ locale: string }> = ({ locale }) => {
  // Removed useTranslations - using hardcoded English

  return (
    <header
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 light-mode-depth bg-gradient-brand-soft"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 h-20">
        <div className="flex items-center justify-between h-full">
          {/* Left Section - Brand */}
          <div className="flex items-center gap-6">
            <NavbarBrand locale={locale} />
            <CTAButton locale={locale} />
          </div>

          {/* Center Section - Desktop Menu */}
          <DesktopMenu locale={locale} />

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            <NavbarActions locale={locale} />
            <MobileMenu locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
