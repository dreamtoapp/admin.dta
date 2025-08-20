"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { serviceIcon, misc, technology } from "@/constant/icons";
import MobileBrand from "./MobileBrand";

// Enhanced Mobile Menu Component
const MobileMenu: React.FC<{ locale: string }> = ({ locale }) => {
  // Removed useTranslations - using hardcoded English
  const [activeItem, setActiveItem] = useState<string>('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Memoize menuItems to prevent recreation on every render
  const menuItems = useMemo(() => [
    { href: '/', label: 'Home', icon: misc.home, color: 'hsl(var(--brand-accent))', rippleColor: 'hsl(var(--brand-accent))', bgColor: 'hsl(var(--brand-accent))' },
    { href: '/services', label: 'Services', icon: serviceIcon.website.icon, color: 'hsl(var(--brand-primary))', rippleColor: 'hsl(var(--brand-primary))', bgColor: 'hsl(var(--brand-primary))' },
    { href: '/worksample', label: 'Portfolio', icon: technology.workSample.icon, color: 'hsl(var(--brand-secondary))', rippleColor: 'hsl(var(--brand-secondary))', bgColor: 'hsl(var(--brand-secondary))' },
    { href: '/contactus', label: 'Contact', icon: misc.emailIcon, color: 'hsl(var(--brand-accent))', rippleColor: 'hsl(var(--brand-accent))', bgColor: 'hsl(var(--brand-accent))' },
  ], []);

  // Set mounted state to true after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set active item based on current pathname - only after mounting
  useEffect(() => {
    if (!isMounted) return;

    const pathname = window.location.pathname;
    const currentItem = menuItems.find(item => {
      if (item.href === '/' && (pathname === `/${locale}` || pathname === '/')) return true;
      return pathname.includes(item.href);
    });

    if (currentItem) {
      setActiveItem(currentItem.href);
    }
  }, [locale, menuItems, isMounted]);

  const handleItemClick = (itemHref: string, itemColor: string) => {
    // Close the sheet first
    setIsSheetOpen(false);

    // Create global ripple effect on navbar
    const navbar = document.querySelector('header') as HTMLElement;
    if (navbar) {
      try {
        // Create ripple element
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: ${itemColor}40;
          transform: scale(0);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: none;
          z-index: 9999;
          transform-origin: top left;
        `;

        // Add to navbar
        navbar.style.position = 'relative';
        navbar.appendChild(ripple);

        // Trigger ripple animation with requestAnimationFrame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ripple.style.transform = 'scale(100)';
            ripple.style.opacity = '0.6';
          });
        });

        // Start fade out animation
        setTimeout(() => {
          ripple.style.opacity = '0';
          ripple.style.transform = 'scale(120)';
        }, 600);

        // Remove ripple after fade out
        setTimeout(() => {
          if (ripple && ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 1000);
      } catch (error) {
        console.warn('Ripple animation failed:', error);
      }
    }

    // Navigate after a short delay
    setTimeout(() => {
      window.location.href = `/${locale}${itemHref}`;
    }, 500);
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden relative group transition-all duration-300 hover:bg-primary/10"
            aria-label="Open menu"
          >
            <div className="relative">
              <Menu className="h-5 w-5 transition-all duration-300 group-hover:rotate-90" />
              <div className="absolute -inset-2 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[320px] sm:w-[400px] bg-background/95 backdrop-blur-xl border-l border-border/50 light-mode-depth bg-gradient-brand-soft flex flex-col">
          <SheetHeader className="pb-4 border-b border-border/20">
            <SheetTitle className="text-center">
              <MobileBrand locale={locale} />
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col flex-1">
            <nav className="pt-4 layout-stable prevent-layout-shift" style={{ minHeight: '20rem', contain: 'layout' }}>
              <div className="space-y-2">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleItemClick(item.href, item.color)}
                      className="relative flex items-center w-full px-4 py-4 text-lg font-medium rounded-xl transition-all duration-300 group hover:bg-muted/20 layout-stable"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        backgroundColor: 'transparent',
                        minHeight: '3.5rem',
                        contain: 'layout'
                      }}
                    >
                      {/* Icon Container */}
                      <div className="relative flex items-center justify-center w-10 h-10 mr-8 rounded-lg transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${item.bgColor}15` }}>
                        <IconComponent
                          className="w-5 h-5 transition-colors duration-300"
                          style={{ color: item.color }}
                        />
                      </div>

                      {/* Label */}
                      <span
                        className="transition-all duration-300 group-hover:translate-x-1"
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* CTA Section - Fixed at bottom */}
          <div className="mt-auto pt-6 px-4 py-4 bg-brand-accent-subtle rounded-xl border border-border/30 light-mode-depth">
            <div className="text-center mb-3">
              <p className="text-sm font-medium text-foreground mb-1">
                Ready to start?
              </p>
              <p className="text-xs text-muted-foreground">
                Get in touch
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => handleItemClick('/contactus', 'hsl(var(--brand-accent))')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-brand-warm text-white rounded-lg text-sm font-semibold hover:bg-gradient-brand-accent transition-all duration-300 hover:scale-105 light-mode-depth hover:light-mode-depth-hover transform hover:-translate-y-1"
              >
                <span>Start Project</span>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden relative group transition-all duration-300 hover:bg-primary/10"
          aria-label="Open menu"
        >
          <div className="relative">
            <Menu className="h-5 w-5 transition-all duration-300 group-hover:rotate-90" />
            <div className="absolute -inset-2 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[400px] bg-background/95 backdrop-blur-xl border-l border-border/50 shadow-2xl flex flex-col">
        <SheetHeader className="pb-4 border-b border-border/20">
          <SheetTitle className="text-center">
            <MobileBrand locale={locale} />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col flex-1">
          <nav className="pt-4">
            <div className="space-y-2">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = activeItem === item.href;

                return (
                  <button
                    key={item.href}
                    onClick={() => handleItemClick(item.href, item.color)}
                    className="relative flex items-center w-full px-4 py-4 text-lg font-medium rounded-xl transition-all duration-300 group hover:bg-brand-secondary-subtle light-mode-depth"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      backgroundColor: isActive ? `${item.bgColor}20` : 'transparent'
                    }}
                  >
                    {/* Icon Container */}
                    <div className="relative flex items-center justify-center w-10 h-10 mr-8 rounded-lg transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${item.bgColor}15` }}>
                      <IconComponent
                        className="w-5 h-5 transition-colors duration-300"
                        style={{ color: item.color }}
                      />
                    </div>

                    {/* Label */}
                    <span
                      className="transition-all duration-300 group-hover:translate-x-1"
                      style={{ color: isActive ? item.color : undefined }}
                    >
                      {item.label}
                    </span>

                    {/* Active Indicator */}
                    {isActive && (
                      <div
                        className="absolute right-4 w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* CTA Section - Fixed at bottom */}
        <div className="mt-auto pt-6 px-4 py-4 bg-brand-accent-subtle rounded-xl border border-brand-accent/30 shadow-lg">
          <div className="text-center mb-3">
            <p className="text-sm font-medium text-foreground mb-1">
              Ready to start?
            </p>
            <p className="text-xs text-muted-foreground">
              Get in touch
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => handleItemClick('/contactus', 'hsl(var(--brand-accent))')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-brand-warm text-white rounded-lg text-sm font-semibold hover:bg-gradient-brand-accent transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-brand-accent/30 transform hover:-translate-y-1"
            >
              <span>Start Project</span>
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu; 