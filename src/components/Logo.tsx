import React from 'react';
import { useTheme } from '../lib/theme';

export default function Logo({ variant }: { variant?: 'light' | 'dark' }) {
  const { theme } = useTheme();
  const isDark = variant ? variant === 'dark' : theme === 'dark';
  
  // Theme-aware color variables
  // Dark: White (#ffffff), Light: Obsidian (#0B0C10)
  const primaryBrand = isDark ? '#ffffff' : '#0B0C10';
  const obsidian = '#0B0C10';
  const brandCyan = '#00f2ff';
  const secondaryOpacity = '0.8';

  return (
    <svg 
      width="850" 
      height="250" 
      viewBox="0 0 850 250" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-auto h-12 md:h-16 transition-colors duration-300"
    >
      <defs>
        <linearGradient id="lineFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={primaryBrand} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={primaryBrand} stopOpacity="0"/>
        </linearGradient>

        <g id="master-circuit">
          <path d="M 75 70 L 80 70 L 95 85 L 105 85" fill="none" />
          <circle cx="105" cy="85" r="2" fill={primaryBrand} />
          <circle cx="75" cy="70" r="3" fill={primaryBrand} />
          <path d="M 65 105 L 80 105 L 90 115 L 105 115" fill="none" />
          <circle cx="105" cy="115" r="2" fill={primaryBrand} />
          <circle cx="65" cy="105" r="3" fill={primaryBrand} />
          <path d="M 55 140 L 70 140 L 85 125 L 100 125" fill="none" />
          <circle cx="100" cy="125" r="2" fill={primaryBrand} />
          <circle cx="55" cy="140" r="3" fill={primaryBrand} />
          <path d="M 90 45 L 105 55 L 105 70" fill="none" />
          <circle cx="90" cy="45" r="1.5" fill={primaryBrand} />
        </g>

        <g id="master-circuit-flow">
          <path className="tech-pulse c-delay-1" d="M 75 70 L 80 70 L 95 85 L 105 85" fill="none" />
          <path className="tech-pulse c-delay-2" d="M 65 105 L 80 105 L 90 115 L 105 115" fill="none" />
          <path className="tech-pulse c-delay-3" d="M 55 140 L 70 140 L 85 125 L 100 125" fill="none" />
        </g>

        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Outfit:wght@500;700&display=swap');
            .word-ginashe { font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: 82px; transition: fill 0.3s ease; }
            .word-digital { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 26px; text-transform: uppercase; transition: fill 0.3s ease; }
            .word-academy { font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 26px; text-transform: uppercase; transition: all 0.3s ease; }
            
            @keyframes flowData {
              0%, 80% { stroke-dashoffset: 50; opacity: 0; }
              82% { opacity: 1; }
              98% { opacity: 1; }
              100% { stroke-dashoffset: -450; opacity: 0; }
            }
            .tech-flow {
              stroke-dasharray: 40 1000;
              animation: flowData 10s infinite cubic-bezier(0.2, 0, 0.2, 1);
            }
            
            @keyframes circuitPulse {
              0%, 80% { stroke-dashoffset: 60; opacity: 0; }
              85% { opacity: 1;  }
              95% { opacity: 1;  }
              100% { stroke-dashoffset: -60; opacity: 0; }
            }
            .tech-pulse {
              stroke: ${brandCyan};
              stroke-width: 2.5;
              stroke-linecap: round;
              stroke-dasharray: 15 120;
              animation: circuitPulse 4s infinite linear;
            }
            .c-delay-1 { animation-delay: 0s; }
            .c-delay-2 { animation-delay: 1.3s; }
            .c-delay-3 { animation-delay: 2.6s; }
          `}
        </style>
      </defs>

      <g transform="translate(15, 10)">
        <path d="M 125 35 C 170 35, 195 45, 195 60 L 195 140 C 195 180, 160 210, 125 225 C 90 210, 55 180, 55 140 L 55 60 C 55 45, 80 35, 125 35 Z" 
              fill={brandCyan} 
              stroke={primaryBrand} 
              strokeWidth="7"
              />

        <g stroke={primaryBrand} strokeWidth="1.5" opacity="0.4">
          <use href="#master-circuit" />
          <use href="#master-circuit" transform="translate(250, 0) scale(-1, 1)" />
          <path d="M 125 35 L 125 65 M 125 185 L 125 225" strokeDasharray="2 4" strokeWidth="2" opacity="0.5" />
        </g>
        <g>
          <use href="#master-circuit-flow" />
          <use href="#master-circuit-flow" transform="translate(250, 0) scale(-1, 1)" />
        </g>

        <path d="M 125 160 L 175 145 L 125 155 L 75 145 Z" fill={primaryBrand} opacity="0.1"/>
        <path d="M 125 170 L 185 155 L 125 165 L 65 155 Z" fill={primaryBrand} opacity="0.15"/>
        <path d="M 125 180 L 190 165 L 125 175 L 60 165 Z" fill="none" stroke={primaryBrand} strokeWidth="1.5" opacity="0.8"/>
        <polygon points="124,155 126,155 132,180 118,180" fill={primaryBrand} />

        <path d="M 160 85 L 125 65 L 90 85 L 90 125 L 125 145 L 160 125 L 160 105 L 125 105" 
              fill="none" 
              stroke={obsidian} 
              strokeWidth="14" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              />

        <polygon points="125,12 145,22 125,32 105,22" fill={primaryBrand} />
        <path d="M 125 22 C 135 27, 140 32, 142 42" fill="none" stroke={primaryBrand} strokeWidth="1.5" />
        <rect x="140" y="40" width="4" height="4" fill={primaryBrand} />
      </g>

      <text x="290" y="125" fill={primaryBrand} className="word-ginashe" textLength="480" lengthAdjust="spacing">GINASHE</text>
      
      <line x1="290" y1="145" x2="770" y2="145" stroke={brandCyan} strokeWidth="20" opacity="0.05" strokeLinecap="round"/>
      <line x1="290" y1="145" x2="770" y2="145" stroke={brandCyan} strokeWidth="12" opacity="0.15" strokeLinecap="round"/>
      
      <line x1="290" y1="145" x2="840" y2="145" stroke="url(#lineFade)" strokeWidth="10" strokeLinecap="round"/>
      <line x1="290" y1="145" x2="770" y2="145" stroke={obsidian} strokeWidth="10" strokeLinecap="round" />

      <line x1="290" y1="145" x2="770" y2="145" stroke={brandCyan} strokeWidth="4" strokeLinecap="round" />

      <line className="tech-flow" x1="290" y1="145" x2="840" y2="145" stroke={primaryBrand} strokeWidth="2" strokeLinecap="round"/>

      <text x="290" y="182" textLength="480" lengthAdjust="spacing">
        <tspan fill={primaryBrand} className="word-digital">DIGITAL</tspan>
        <tspan fill={primaryBrand} className="word-academy" style={{ opacity: secondaryOpacity }}> ACADEMY</tspan>
      </text>
    </svg>
  );
}
