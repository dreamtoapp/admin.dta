import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        // DreamToApp Brand Colors
        brand: {
          primary: "#0d3ad7",    // Dark blue
          secondary: "#99e4ff",  // Light blue
          accent: "#d7a50d",     // Golden yellow
          "primary-dark": "#0a2eb3", // Darker shade for hover states
          "secondary-light": "#b3edff", // Lighter shade for backgrounds
          "accent-light": "#e6c25a", // Lighter shade for backgrounds
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"], // System fonts
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      backgroundImage: {
        // DreamToApp Brand Gradients
        "gradient-brand-primary": "linear-gradient(135deg, #0d3ad7 0%, #99e4ff 100%)", // Primary to secondary
        "gradient-brand-secondary": "linear-gradient(135deg, #99e4ff 0%, #d7a50d 100%)", // Secondary to accent
        "gradient-brand-accent": "linear-gradient(135deg, #d7a50d 0%, #0d3ad7 100%)", // Accent to primary
        "gradient-brand-hero": "linear-gradient(135deg, #0d3ad7 0%, #99e4ff 50%, #d7a50d 100%)", // Full brand spectrum
        "gradient-brand-vertical": "linear-gradient(to bottom, #0d3ad7 0%, #99e4ff 50%, #d7a50d 100%)", // Vertical brand spectrum
        "gradient-brand-subtle": "linear-gradient(135deg, #99e4ff 0%, #b3edff 100%)", // Subtle light blue
        "gradient-brand-warm": "linear-gradient(135deg, #d7a50d 0%, #e6c25a 100%)", // Warm golden
        "gradient-brand-cool": "linear-gradient(135deg, #0d3ad7 0%, #0a2eb3 100%)", // Cool dark blue

        // Legacy Gradients (keeping for compatibility)
        "gradient-custom": "linear-gradient(to bottom, #0f172a, #1f2937, #374151, rgba(55, 65, 81, 0))",
        "gradient-sunset": "linear-gradient(to bottom, #ff7e5f, #feb47b)",
        "gradient-ocean": "linear-gradient(to bottom, #2193b0, #6dd5ed)",
        "gradient-purple": "linear-gradient(to bottom, #8e2de2, #4a00e0)",
        "gradient-tropical": "linear-gradient(to bottom, #00c6ff, #0072ff)",
        "gradient-golden": "linear-gradient(to bottom, #f2994a, #f2c94c)",
        "gradient-forest": "linear-gradient(to bottom, #11998e, #38ef7d)",
        "gradient-gray": "linear-gradient(to bottom, #2c3e50, #bdc3c7)",
        "gradient-blue-official": "linear-gradient(to bottom, #0f172a, #1e40af, #2563eb)",
        "gradient-blue-sky": "linear-gradient(to bottom, #2563eb, #60a5fa, #93c5fd)",
        "gradient-blue-fade": "linear-gradient(to bottom, #1e3a8a, #3b82f6, rgba(59, 130, 246, 0))",
        "gradient-blue-ocean": "linear-gradient(to bottom, #0f172a, #1e3a8a, #2563eb, #60a5fa)",
        "gradient-blue-corporate": "linear-gradient(to bottom, #1e40af, #3b82f6)",
        "gradient-blue-light": "linear-gradient(to bottom, #e0f2fe, #90cdf4)",
        "gradient-blue-modern": "linear-gradient(to bottom, #cfe8ff, #3b82f6)",
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.15)', opacity: '0.8' },
        },
        'pulse-slower': {
          '0%, 100%': { transform: 'scale(1.1)', opacity: '0.5' },
          '50%': { transform: 'scale(0.95)', opacity: '0.7' },
        },
        float: {
          '0%': { transform: 'translateY(0)', opacity: '0.2' },
          '30%': { opacity: '1' },
          '50%': { transform: 'translateY(-40px)', opacity: '0.7' },
          '70%': { opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '0.2' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 6s ease-in-out infinite',
        'pulse-slower': 'pulse-slower 10s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
