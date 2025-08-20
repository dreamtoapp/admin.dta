"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { serviceIcon, misc, technology } from "@/constant/icons";

// Enhanced Desktop Navigation Menu
const DesktopMenu: React.FC<{ locale: string }> = ({ locale }) => {
  // Removed useTranslations - using hardcoded English
  const [activeItem, setActiveItem] = useState<string>('');
  const [rippleStates, setRippleStates] = useState<Record<string, { isActive: boolean; isAnimating: boolean }>>({});
  const [isMounted, setIsMounted] = useState(false);

  // Memoize menuItems to prevent recreation on every render
  const menuItems = useMemo(() => [
    { href: '/', label: 'Home', icon: misc.home, color: '#d7a50d', rippleColor: '#d7a50d', bgColor: '#d7a50d' }, // Gold
    { href: '/services', label: 'Services', icon: serviceIcon.website.icon, color: '#0d3ad7', rippleColor: '#0d3ad7', bgColor: '#0d3ad7' }, // Blue
    { href: '/worksample', label: 'Portfolio', icon: technology.workSample.icon, color: '#99e4ff', rippleColor: '#99e4ff', bgColor: '#99e4ff' }, // Light Blue
    { href: '/contactus', label: 'Contact', icon: misc.emailIcon, color: '#d7a50d', rippleColor: '#d7a50d', bgColor: '#d7a50d' }, // Gold (reusing for contact)
  ], []);

  // Initialize ripple states only once when menuItems change
  useEffect(() => {
    const initialStates: Record<string, { isActive: boolean; isAnimating: boolean }> = {};
    menuItems.forEach(item => {
      initialStates[item.href] = { isActive: false, isAnimating: false };
    });
    setRippleStates(initialStates);
  }, [menuItems]);

  // Set mounted state to true after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set active item based on current pathname - only after mounting
  useEffect(() => {
    if (!isMounted) return;

    const pathname = window.location.pathname;
    const currentItem = menuItems.find(item => {
      // Handle home page special case
      if (item.href === '/' && (pathname === `/${locale}` || pathname === '/')) return true;
      // Handle other pages
      return pathname.includes(item.href);
    });

    if (currentItem) {
      setActiveItem(currentItem.href);
      // Set persistent ripple for active item (like radio button)
      setRippleStates(prev => ({
        ...prev,
        [currentItem.href]: { isActive: true, isAnimating: false }
      }));
    }
  }, [locale, menuItems, isMounted]);

  const handleItemClick = (itemHref: string) => {
    // Reset all ripples first
    setRippleStates(prev => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach(key => {
        newStates[key] = { isActive: false, isAnimating: false };
      });
      return newStates;
    });

    // Set new active item
    setActiveItem(itemHref);

    // Set ripple to expanded state immediately (no animation phase)
    setRippleStates(prev => ({
      ...prev,
      [itemHref]: { isActive: true, isAnimating: false }
    }));
  };

  // Use consistent rendering structure to prevent hydration mismatch
  return (
    <nav className="hidden md:flex items-center gap-4 layout-stable prevent-layout-shift" style={{ minHeight: '3rem', contain: 'layout' }}>
      {menuItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = isMounted ? activeItem === item.href : false;
        const rippleState = isMounted ? (rippleStates[item.href] || { isActive: false, isAnimating: false }) : { isActive: false, isAnimating: false };

        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex items-center gap-3 group p-2 rounded-lg transition-all duration-300 hover:bg-brand-secondary-subtle light-mode-depth"
            onClick={isMounted ? () => handleItemClick(item.href) : undefined}
            style={{ minHeight: '3rem', contain: 'layout' }}
          >
            {/* Menu Item Button */}
            <div className="relative flex h-[50px] w-[50px] items-center justify-center">
              <div
                className={`absolute h-full w-full rounded-full p-4 light-mode-depth duration-300 group-hover:scale-110 group-hover:ring-2 light-mode-depth-hover ${isActive ? 'ring-2 scale-110' : ''
                  }`}
                style={{
                  backgroundColor: `${item.bgColor}30`,
                  borderColor: item.color,
                  borderWidth: isActive ? '2px' : '0px'
                }}
              />

              {/* Ripple Effect */}
              <div
                className={`absolute -z-10 h-full w-full rounded-full transition-all duration-300 ease-out pointer-events-none ${rippleState.isActive
                  ? 'scale-[6] opacity-40'
                  : 'scale-0 opacity-0'
                  }`}
                style={{ backgroundColor: `${item.rippleColor}90` }}
              />

              <div style={{ color: item.color }}>
                <IconComponent
                  className="w-6 h-6 transition-colors duration-300 relative z-10"
                />
              </div>
            </div>

            {/* Title/Label - Directly beside icon */}
            <span
              className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive ? 'opacity-100' : 'text-muted-foreground opacity-70 group-hover:opacity-100'
                }`}
              style={{ color: isActive ? item.color : undefined }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );


};

export default DesktopMenu;