"use client";
import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a placeholder during SSR and initial mount
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full w-9 h-9",
          "bg-brand-secondary-subtle hover:bg-brand-secondary-subtle/80",
          "border border-border/20",
          "transition-all duration-300 light-mode-depth"
        )}
      >
        <div>
          <FaSun
            className={cn(
              "w-5 h-5",
              "text-muted-foreground",
              "transition-all duration-300"
            )}
          />
        </div>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "rounded-full w-9 h-9",
        "bg-brand-secondary-subtle hover:bg-brand-secondary-subtle/80",
        "border border-border/20",
        "transition-all duration-300 light-mode-depth"
      )}
    >
      <div>
        {theme === "light" ? (
          <FaSun
            className={cn(
              "w-5 h-5",
              "text-accent",
              "transition-all duration-300",
              "hover:rotate-90"
            )}
          />
        ) : (
          <FaMoon
            className={cn(
              "w-5 h-5",
              "text-primary",
              "transition-all duration-300",
              "hover:-rotate-12"
            )}
          />
        )}
      </div>
    </Button>
  );
}
