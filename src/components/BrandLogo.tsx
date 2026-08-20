import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export function BrandLogo({
  size = 'md',
  className = '',
  showWordmark = false,
  wordmarkClassName = '',
}: BrandLogoProps) {
  // Determine pixel size
  let dimension = 44;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'xs':
        dimension = 28;
        break;
      case 'sm':
        dimension = 36;
        break;
      case 'md':
        dimension = 48;
        break;
      case 'lg':
        dimension = 64;
        break;
      case 'xl':
        dimension = 96;
        break;
      default:
        dimension = 48;
    }
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Scalable High-Fidelity SVG Emblem matching the official MC STORE FUTEBOL Logo */}
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-md transition-transform duration-200"
        aria-label="MC Store Futebol Logo"
      >
        <defs>
          {/* Gold Metallic Gradients */}
          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A1" />
            <stop offset="25%" stopColor="#E5B232" />
            <stop offset="50%" stopColor="#966C15" />
            <stop offset="75%" stopColor="#FAD355" />
            <stop offset="100%" stopColor="#8A5B0B" />
          </linearGradient>

          <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#D97706" />
            <stop offset="70%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF8D6" />
            <stop offset="45%" stopColor="#EAB308" />
            <stop offset="55%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>

          <linearGradient id="silverText" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Dark Background Gradient */}
          <radialGradient id="darkBg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#050811" />
          </radialGradient>

          {/* Ball 3D Shading */}
          <radialGradient id="ballShade" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#475569" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#EAB308" floodOpacity="0.4" />
          </filter>
          <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.9" />
          </filter>
        </defs>

        {/* 1. Outer Dark Circular Coin / Badge */}
        <circle cx="100" cy="100" r="96" fill="url(#darkBg)" stroke="#0F172A" strokeWidth="2" />

        {/* 2. Gold Metallic Outer Ring */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="url(#goldRim)" strokeWidth="4.5" filter="url(#goldGlow)" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#0B0F19" strokeWidth="2" opacity="0.8" />
        <circle cx="100" cy="100" r="86" fill="none" stroke="url(#goldRim)" strokeWidth="1" opacity="0.6" />

        {/* 3. Heraldic Shield Background */}
        <g filter="url(#goldGlow)">
          {/* Shield Outer Gold Border */}
          <path
            d="M100 24 
               C135 24, 168 34, 168 56 
               C168 118, 142 156, 100 178 
               C58 156, 32 118, 32 56 
               C32 34, 65 24, 100 24 Z"
            fill="#090D16"
            stroke="url(#shieldGold)"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Inner Shield Accent Line */}
          <path
            d="M100 32 
               C130 32, 158 40, 158 60 
               C158 112, 136 146, 100 166 
               C64 146, 42 112, 42 60 
               C42 40, 70 32, 100 32 Z"
            fill="#0B1120"
            stroke="url(#goldRim)"
            strokeWidth="1.8"
            opacity="0.85"
            strokeLinejoin="round"
          />
        </g>

        {/* 4. Realistic 3D Soccer Ball at Top Apex */}
        <g transform="translate(0, -6)">
          {/* Ball Base Circle */}
          <circle cx="100" cy="64" r="32" fill="url(#ballShade)" stroke="#0F172A" strokeWidth="1.5" />
          
          {/* Ball Pentagons (Classic Soccer Pattern) */}
          <g fill="#0F172A" stroke="#334155" strokeWidth="1">
            {/* Center Pentagon */}
            <polygon points="100,56 108,62 105,71 95,71 92,62" />
            {/* Top Pentagon Piece */}
            <polygon points="96,35 104,35 107,44 100,48 93,44" />
            {/* Top-Right Pentagon Piece */}
            <polygon points="121,46 128,52 124,61 115,58 113,49" />
            {/* Bottom-Right Pentagon Piece */}
            <polygon points="119,77 126,82 120,90 111,88 111,79" />
            {/* Bottom-Left Pentagon Piece */}
            <polygon points="81,77 89,79 89,88 80,90 74,82" />
            {/* Top-Left Pentagon Piece */}
            <polygon points="79,46 87,49 85,58 76,61 72,52" />
          </g>

          {/* Seam lines connecting pentagons */}
          <path
            d="M100 48 L100 56 
               M108 62 L115 58 
               M105 71 L111 79 
               M95 71 L89 79 
               M92 62 L85 58"
            stroke="#1E293B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Ball highlight glare */}
          <ellipse cx="90" cy="48" rx="8" ry="4" fill="#FFFFFF" opacity="0.35" transform="rotate(-25 90 48)" />
        </g>

        {/* 5. Center Banner Bar & Background */}
        <g filter="url(#textShadow)">
          {/* Angled Dark Plate */}
          <polygon
            points="18,110 182,102 184,142 16,146"
            fill="#030712"
            stroke="url(#goldRim)"
            strokeWidth="1.5"
          />
          
          {/* "MC STORE" Metallic Typography */}
          <g transform="translate(100, 126) skewX(-7)">
            {/* "MC" In Silver */}
            <text
              x="-48"
              y="0"
              textAnchor="middle"
              fill="url(#silverText)"
              stroke="#000000"
              strokeWidth="2.5"
              paintOrder="stroke fill"
              fontSize="24"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="0.5"
            >
              MC
            </text>

            {/* "STORE" In Metallic Gold */}
            <text
              x="20"
              y="0"
              textAnchor="middle"
              fill="url(#goldText)"
              stroke="#000000"
              strokeWidth="2.5"
              paintOrder="stroke fill"
              fontSize="24"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="1"
            >
              STORE
            </text>
          </g>

          {/* 6. "FUTEBOL" Bottom Plate and Typography */}
          <g transform="translate(100, 148)">
            <rect
              x="-44"
              y="-10"
              width="88"
              height="15"
              rx="3"
              fill="#0F172A"
              stroke="url(#goldRim)"
              strokeWidth="0.8"
            />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="3.5"
            >
              FUTEBOL
            </text>
          </g>
        </g>

        {/* 7. Bottom Gold Stars & Finishing Accents */}
        <g fill="url(#goldRim)">
          {/* Mini accent stars */}
          <polygon points="100,183 101.5,187 106,187 102.5,190 104,194 100,191.5 96,194 97.5,190 94,187 98.5,187" />
        </g>
      </svg>

      {/* Optional Side Wordmark for Headers and Footers */}
      {showWordmark && (
        <div className={`text-left ${wordmarkClassName}`}>
          <div className="font-black text-lg sm:text-xl text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
            <span>MC STORE</span>
            <span className="text-amber-500 font-extrabold">FUTEBOL</span>
          </div>
          <div className="text-[10px] sm:text-[11px] font-black text-slate-400 tracking-wider uppercase mt-1">
            DISTRIBUIDORA B2B 1:1
          </div>
        </div>
      )}
    </div>
  );
}
