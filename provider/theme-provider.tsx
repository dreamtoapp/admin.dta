"use client";

import { useEffect } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Force dark mode permanently
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');

    // Remove any theme-related attributes
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-mode');
  }, []);

  return <>{children}</>;
}
