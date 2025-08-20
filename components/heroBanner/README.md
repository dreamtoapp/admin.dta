# Hero Banner Components

This folder contains the modular components for the hero banner section of the DreamToApp website.

## Component Structure

### Main Components

- **`NewHero.tsx`** - Main hero section component that orchestrates all sub-components
- **`HeroContent.tsx`** - Combines logo, text, and CTA elements
- **`HeroLogo.tsx`** - Logo component with dark/light mode support
- **`HeroText.tsx`** - Text elements (title, tagline, description)
- **`HeroCTA.tsx`** - Call-to-action buttons
- **`WaveBackground.tsx`** - Animated wave background
- **`HeroStyles.tsx`** - CSS-in-JS styles for the hero section

### Exports

All components are exported through `index.ts` for easy importing:

```typescript
import { 
  HeroSection, 
  HeroLogo, 
  HeroText, 
  HeroCTA, 
  WaveBackground, 
  HeroStyles, 
  HeroContent 
} from '@/components/heroBanner';
```

## Usage

### Basic Usage

```typescript
import HeroSection from '@/components/heroBanner/NewHero';

const heroProps = {
  logoAlt: "DreamToApp Logo",
  tagline: "DREAM. DESIGN. DELIVER.",
  title: "DreamToApp IT Solutions",
  description: "Leading tech agency crafting web, mobile, and cloud solutions",
  ctaPrimary: "Start Your Dream",
  ctaSecondary: "Explore Services",
  slogan: "Where Dreams Begin",
  sectionsHero: "Hero Section",
  locale: "en"
};

<HeroSection {...heroProps} />
```

### Individual Components

You can also use individual components for custom layouts:

```typescript
import { HeroLogo, HeroText, HeroCTA } from '@/components/heroBanner';

<div className="custom-hero">
  <HeroLogo logoAlt="Logo" locale="en" />
  <HeroText 
    tagline="Custom Tagline"
    title="Custom Title"
    description="Custom description"
  />
  <HeroCTA 
    ctaPrimary="Primary Action"
    ctaSecondary="Secondary Action"
    locale="en"
  />
</div>
```

## Features

- **Responsive Design** - Adapts to all screen sizes
- **Dark/Light Mode** - Automatic theme switching
- **RTL Support** - Full right-to-left layout support
- **Animations** - Smooth wave animations and hover effects
- **Accessibility** - ARIA labels and semantic HTML
- **Performance** - Memoized components and optimized rendering

## Props Interface

```typescript
interface HeroProps {
  logoAlt: string;
  tagline: string;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  slogan: string;
  sectionsHero: string;
  className?: string;
  locale: string;
}
```

## Styling

The hero section uses a combination of:
- **Tailwind CSS** for responsive utilities
- **CSS-in-JS** for complex animations and effects
- **Custom CSS classes** for specific styling needs

## Animation Classes

- `.playing` - Applied to start wave animations
- `.cta-button` - Base button styles
- `.cta-button.primary` - Primary action button
- `.cta-button.secondary` - Secondary action button
- `.cta-button.tertiary` - Tertiary action button (job application)

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Progressive enhancement for older browsers
- Mobile-first responsive design 