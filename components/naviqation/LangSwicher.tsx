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
