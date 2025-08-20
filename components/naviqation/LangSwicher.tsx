"use client";
// Removed next-intl and i18n routing dependencies
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo, memo } from "react";
import arabic from "@/public/assets/arabic.png";
import english from "@/public/assets/english.png";

const languageData = {
  ar: { image: arabic, label: "Arabic" },
  en: { image: english, label: "English" },
} as const;

type LocaleType = keyof typeof languageData;

const LangSwitcher = memo(function LangSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  // Removed useTranslations - using hardcoded English

  // Memoize the current language data to prevent unnecessary re-renders
  const currentLanguage = useMemo(() => languageData[locale as LocaleType], [locale]);

  // Get the pathname without the current locale prefix - FIXED VERSION
  const pathWithoutLocale = useMemo(() => {
    // Ensure we have a valid pathname
    if (!pathname || pathname === '/') return '/';

    // Remove the locale prefix more safely
    const pathSegments = pathname.split('/');
    if (pathSegments.length > 1 && ['ar', 'en'].includes(pathSegments[1])) {
      // Remove the locale segment and join the rest
      return '/' + pathSegments.slice(2).join('/');
    }

    // If no locale prefix found, return the original pathname
    return pathname;
  }, [pathname]);

  // Get the target locale
  const targetLocale = useMemo(() => {
    return locale === "ar" ? "en" : "ar";
  }, [locale]);

  useEffect(() => {
    // Set mounted immediately to prevent skeleton flash
    setMounted(true);
  }, []);

  // Show skeleton only if not mounted (should be very brief)
  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted animate-pulse">
        <div className="w-4 h-4 bg-muted-foreground/20 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-1 rounded-lg">
      <Link
        href={pathWithoutLocale}
        locale={targetLocale}
        className="flex items-center justify-center w-6 h-6 rounded-full overflow-hidden border border-transparent hover:border-border light-mode-depth transition-all duration-300"
        aria-label={`Switch to ${languageData[targetLocale as LocaleType].label}`}
      >
        <Image
          src={currentLanguage.image}
          width={24}
          height={24}
          alt={currentLanguage.label}
          className="rounded-full"
          priority
        />
      </Link>
    </div>
  );
});

export default LangSwitcher;

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Removed useTranslations - using hardcoded English

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.toggle("dark");
    setIsDarkMode(isCurrentlyDark);
  };

  return (
    <button
      className="flex items-center justify-center w-6 h-6   rounded-full bg-muted hover:bg-muted/80 transition-all duration-300"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
