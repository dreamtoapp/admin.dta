"use client"
import React from 'react';
import Link from '@/components/link';

interface HeroCTAProps {
  ctaPrimary: string;
  ctaSecondary: string;
  locale: string;
}

const HeroCTA: React.FC<HeroCTAProps> = ({ ctaPrimary, ctaSecondary, locale }) => {
  // Ensure consistent href generation
  const primaryHref = `/${locale}/start-your-dream`;
  const secondaryHref = `/${locale}/services`;
  const tertiaryHref = `/${locale}/apply-job`;

  return (
    <div className="flex flex-wrap gap-3 md:gap-4 justify-center dom-optimized">
      <Link
        href={primaryHref}
        className="cta-button primary"
      >
        {ctaPrimary}
      </Link>
      <Link
        href={secondaryHref}
        className="cta-button secondary"
      >
        {ctaSecondary}
      </Link>
      <Link
        href={tertiaryHref}
        className="cta-button tertiary"
        title="انضم إلى فريقنا"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </Link>
    </div>
  );
};

export default HeroCTA; 