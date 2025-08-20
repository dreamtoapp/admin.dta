"use client"
import React from 'react';

const HeroStyles: React.FC = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      .hero-content {
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 90dvh;
        padding: 2rem;
      }
      
      .e-card {
        margin: 0;
        background: transparent;
        box-shadow: 0px 16px 48px -12px rgba(13,58,215,0.4), 0px 4px 16px -4px rgba(215,165,13,0.3), 0px 8px 32px -8px rgba(153,228,255,0.2);
        position: relative;
        width: 100%;
        min-height: 100vh;
        border-radius: 0;
        overflow: hidden;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(153,228,255,0.3);
      }
      
      .wave {
        position: absolute;
        width: 150%;
        height: 150vh;
        opacity: 0.8;
        left: 0;
        top: 0;
        margin-left: -25%;
        margin-top: -25%;
        background: linear-gradient(744deg, #d7a50d, #0d3ad7 60%, #99e4ff);
        border-radius: 45%;
        animation: wave 120s infinite linear;
      }
      
      .wave:nth-child(2),
      .wave:nth-child(3) {
        top: 60%;
      }
      
      .wave:nth-child(2) {
        background: linear-gradient(744deg, #99e4ff, #d7a50d 40%, #0d3ad7 80%);
        opacity: 0.7;
        animation-duration: 100s;
        filter: blur(3px);
      }
      
      .wave:nth-child(3) {
        background: linear-gradient(744deg, #0d3ad7, #99e4ff 30%, #d7a50d 70%);
        opacity: 0.6;
        animation-duration: 90s;
        filter: blur(4px);
      }
      
      .wave:nth-child(4) {
        background: radial-gradient(circle at 30% 70%, #d7a50d 0%, #0d3ad7 50%, #99e4ff 100%);
        opacity: 0.5;
        animation-duration: 80s;
        filter: blur(5px);
        top: 30%;
      }
      
      .hero-logo {
        width: clamp(180px, 25vw, 320px);
        height: clamp(60px, 8vw, 100px);
        object-fit: contain;
        filter: drop-shadow(0 12px 60px rgba(215,165,13,1)) drop-shadow(0 0 80px rgba(153,228,255,1)) drop-shadow(0 0 50px rgba(13,58,215,0.9));
        animation: brandPulse 2s ease-in-out infinite;
      }
      
      .infotop {
        text-align: center;
        font-size: clamp(28px, 5vw, 56px);
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-50%);
        color: rgb(255, 255, 255);
        font-weight: 700;
        text-shadow: 0 4px 20px rgba(13,58,215,0.8), 0 0 40px rgba(215,165,13,0.4), 0 2px 8px rgba(153,228,255,0.6);
        backdrop-filter: blur(15px);
        background: linear-gradient(135deg, rgba(215,165,13,0.2), rgba(13,58,215,0.15), rgba(153,228,255,0.1));
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 0;
        padding: 2rem;
        margin: 0 2rem;
        animation: float 3s ease-in-out infinite;
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      .cta-button {
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 600;
        font-size: clamp(16px, 2vw, 20px);
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(153,228,255,0.4);
        color: white;
        min-height: 56px;
        min-width: 200px;
      }
      
      @media (max-width: 768px) {
        .cta-button {
          padding: 1.25rem 2.5rem;
          font-size: 18px;
          min-height: 64px;
          min-width: 240px;
        }
        
        .cta-button.tertiary {
          padding: 1.25rem;
          width: 70px;
          height: 70px;
          min-width: 70px;
          min-height: 70px;
        }
        
        .cta-button.tertiary svg {
          width: 28px;
          height: 28px;
        }
      }
      
      .cta-button.primary {
        background: linear-gradient(135deg, #d7a50d, #f4c430);
        box-shadow: 0 8px 32px rgba(215,165,13,0.4), 0 4px 16px rgba(215,165,13,0.2);
        border: 2px solid rgba(215,165,13,0.3);
      }
      
      .cta-button.secondary {
        background: linear-gradient(135deg, rgba(13,58,215,0.1), rgba(153,228,255,0.1));
        border: 2px solid rgba(153,228,255,0.6);
        color: rgba(153,228,255,0.9);
        box-shadow: 0 8px 32px rgba(153,228,255,0.2);
      }
      
      .cta-button:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 12px 48px rgba(215,165,13,0.5), 0 0 30px rgba(153,228,255,0.4);
        border-color: rgba(153,228,255,0.8);
      }
      
      .cta-button.primary:hover {
        background: linear-gradient(135deg, #f4c430, #d7a50d);
        box-shadow: 0 16px 64px rgba(215,165,13,0.6), 0 8px 32px rgba(215,165,13,0.3);
      }
      
      .cta-button.secondary:hover {
        background: linear-gradient(135deg, rgba(13,58,215,0.2), rgba(153,228,255,0.2));
        color: white;
        border-color: rgba(153,228,255,0.9);
      }
      
      .cta-button.tertiary {
        background: #22c55e;
        box-shadow: 0 8px 32px rgba(34,197,94,0.4), 0 4px 16px rgba(34,197,94,0.2);
        border: 2px solid #16a34a;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        min-width: 60px;
        min-height: 60px;
        position: relative;
        z-index: 10;
      }
      
      .cta-button.tertiary:hover {
        background: #16a34a;
        box-shadow: 0 16px 64px rgba(34,197,94,0.6), 0 8px 32px rgba(34,197,94,0.3);
        transform: translateY(-2px) scale(1.05);
      }
      
      .cta-button.tertiary svg {
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
      }
      
      .playing .wave {
        border-radius: 40%;
        animation: wave 8000ms infinite linear;
      }
      
      .playing .wave:nth-child(2) {
        animation-duration: 10000ms;
      }
      
      .playing .wave:nth-child(3) {
        animation-duration: 12000ms;
      }
      
      .playing .wave:nth-child(4) {
        animation-duration: 14000ms;
      }
      
      @keyframes wave {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(-50%) translateX(0px);
        }
        50% {
          transform: translateY(-50%) translateX(10px);
        }
      }
      
      @keyframes brandPulse {
        0%, 100% {
          transform: scale(1);
          filter: drop-shadow(0 4px 20px rgba(215,165,13,0.8)) drop-shadow(0 0 30px rgba(153,228,255,0.6));
        }
        50% {
          transform: scale(1.05);
          filter: drop-shadow(0 6px 30px rgba(215,165,13,1)) drop-shadow(0 0 40px rgba(153,228,255,0.8)) drop-shadow(0 0 20px rgba(13,58,215,0.7));
        }
      }
    `
  }} />
);

export default HeroStyles; 