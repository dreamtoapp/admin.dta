"use client";

import React from "react";
import Link from "next/link";
// Removed next-intl dependency
import { Button } from "@/components/ui/button";

// Enhanced CTA Button
const CTAButton: React.FC<{ locale: string }> = ({ locale }) => {
  return (
    <Link href={`/${locale}/start-your-dream`}>
      <div className="relative group">
        <style jsx>{`
          @keyframes sharp-glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(215, 165, 13, 0.3), 0 0 40px rgba(13, 58, 215, 0.2);
            }
            50% {
              box-shadow: 0 0 30px rgba(215, 165, 13, 0.6), 0 0 60px rgba(13, 58, 215, 0.4);
            }
          }
          
          @keyframes sharp-border {
            0%, 100% {
              border-image: linear-gradient(45deg, hsl(var(--brand-accent)), hsl(var(--brand-primary)), hsl(var(--brand-accent))) 1;
            }
            50% {
              border-image: linear-gradient(45deg, hsl(var(--brand-primary)), hsl(var(--brand-accent)), hsl(var(--brand-primary))) 1;
            }
          }
          
          @keyframes sharp-rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          
          .sharp-button {
            border: 2px solid transparent;
            background: hsl(var(--brand-accent)) !important;
            color: white !important;
          }
          
          .sharp-button:hover {
            background: hsl(var(--brand-accent-light)) !important;
            color: white !important;
          }
          
          .ripple-button {
            background: hsl(var(--brand-accent)) !important;
            color: white !important;
            position: relative;
            overflow: hidden;
          }
          
          .ripple-button:hover {
            background: hsl(var(--brand-accent-light)) !important;
            color: white !important;
            transform: scale(1.1);
            box-shadow: 0 0 20px hsl(var(--brand-accent) / 0.4);
          }
          
          .ripple-button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
            pointer-events: none;
          }
          
          .ripple-button:hover::before {
            width: 300px;
            height: 300px;
          }
          
          .menu-item {
            position: relative;
            overflow: hidden;
            border-radius: 8px;
          }
          
          .sharp-ring {
            position: absolute;
            inset: -3px;
            border: 2px solid transparent;
            border-radius: inherit;
            background: linear-gradient(45deg, hsl(var(--brand-accent)), hsl(var(--brand-primary)), hsl(var(--brand-secondary)), hsl(var(--brand-accent))) border-box;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            animation: sharp-rotate 4s linear infinite;
          }
          
          .sharp-button:hover .sharp-ring {
            animation: sharp-rotate 2s linear infinite;
          }
        `}</style>

        <div className="relative flex items-center justify-center">
          <Button
            className="ripple-button inline-flex items-center gap-1 md:gap-2 text-white font-bold px-3 py-1.5 md:px-6 md:py-2 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-110 hover:ring-2 hover:ring-white/50 text-xs md:text-sm relative overflow-hidden light-mode-depth"
            style={{ backgroundColor: 'hsl(var(--brand-accent))' }}
          >
            {/* Ripple Effect Background */}
            <div className="absolute inset-0 scale-0 rounded-lg bg-white/20 transition-transform duration-500 group-hover:scale-[500%] pointer-events-none"></div>

            {/* Main Content */}
            <span className="relative z-10">Start Project</span>
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full animate-pulse relative z-10" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default CTAButton; 