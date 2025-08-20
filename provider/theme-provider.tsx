"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
type ThemeProviderProps = {
  children: React.ReactNode;
  // Add any other props you expect here
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
