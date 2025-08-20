import './globals.css';

export const metadata = {
  manifest: '/manifest.json',
  metadataBase: new URL('https://www.dreamto.app'),
  title: {
    default: 'DreamToApp IT Solutions – Digital Innovation Agency',
    template: '%s | DreamToApp IT Solutions',
  },
  description: 'DreamToApp is a leading IT agency offering web, mobile, and cloud solutions. Explore our portfolio, services, and contact us for digital excellence.',
  openGraph: {
    title: 'DreamToApp IT Solutions',
    description: 'Digital innovation, web, mobile, and cloud solutions for your business.',
    url: 'https://www.dreamto.app',
    siteName: 'DreamToApp IT Solutions',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DreamToApp IT Solutions',
      },
    ],
    locale: 'en',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dreamtoapp',
    title: 'DreamToApp IT Solutions',
    description: 'Digital innovation, web, mobile, and cloud solutions for your business.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: 'https://www.dreamto.app',
  },
  verification: {
    google: 'your-google-site-verification',
  },
};

import NextTopLoader from 'nextjs-toploader';
import { Suspense } from 'react';
import Script from 'next/script';

import { Toaster } from '@/components/ui/sonner';
import { systemFonts } from './font';
import { ThemeProvider } from '@/provider/theme-provider';
import BackToTopWrapper from '@/components/ui/BackToTopWrapper';
import { GTMProvider } from '@/components/GTMProvider';

// Loading component for suspense boundaries
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
    >
      <head suppressHydrationWarning>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* GTM Resource Hints */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={`${systemFonts.className} min-h-screen bg-background antialiased`}>
        {/* GTM Script - Next.js Official Method */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID || 'GTM-P43DC5FM'}`}
        />

        {/* GTM NoScript - For users with JavaScript disabled */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID || 'GTM-P43DC5FM'}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <NextTopLoader />

        <ThemeProvider>
          <GTMProvider locale="en">
            {children}
          </GTMProvider>
        </ThemeProvider>

        <Toaster position="top-right" />
        <BackToTopWrapper />
      </body>
    </html>
  );
}

// To analyze your bundle, run: BUNDLE_ANALYZE=true pnpm build
// import withBundleAnalyzer from '@next/bundle-analyzer';