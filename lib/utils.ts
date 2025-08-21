import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Extract client IP behind common proxies/CDNs
import type { NextRequest } from "next/server"
export function getClientIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]?.trim() || null
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("true-client-ip") ||
    null
  )
}

/**
 * Format date consistently for both server and client to prevent hydration mismatches
 * Uses a fixed format that doesn't depend on locale differences
 */
export function formatDateConsistent(date: Date | string | undefined): string {
  if (!date) return "غير محدد";

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "تاريخ غير صحيح";

    // Use a consistent format that works the same on server and client
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
  } catch {
    return "تاريخ غير صحيح";
  }
}

/**
 * Format date with Arabic locale but in a consistent way
 * Uses a fixed calendar system to prevent hydration mismatches
 */
export function formatDateArabic(date: Date | string | undefined): string {
  if (!date) return "غير محدد";

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "تاريخ غير صحيح";

    // Use a consistent format that works the same on server and client
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    // Return in Arabic numerals but with consistent formatting
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const convertToArabic = (num: string) => num.split('').map(d => arabicNumerals[parseInt(d)]).join('');

    return `${convertToArabic(day)}/${convertToArabic(month)}/${convertToArabic(year.toString())}`;
  } catch {
    return "تاريخ غير صحيح";
  }
}
