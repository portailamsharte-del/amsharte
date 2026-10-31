import React from 'react';

interface AuthenticLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'responsive';
  className?: string;
  withContainer?: boolean;
  onClick?: () => void;
  title?: string;
}

export const AuthenticLogo: React.FC<AuthenticLogoProps> = ({
  size = 'md',
  className = '',
  withContainer = false,
  onClick,
  title = "Logo Authentique ONG AMSHARTE"
}) => {
  // Size mapping for the SVG container
  const sizeMap: Record<string, string> = {
    xs: 'w-16 h-9',
    sm: 'w-24 h-13',
    md: 'w-32 h-18',
    lg: 'w-44 h-24',
    xl: 'w-56 h-31',
    '2xl': 'w-72 h-40',
    responsive: 'w-full h-auto max-w-[360px]'
  };

  const svgContent = (
    <svg 
      viewBox="0 0 400 220" 
      className={`${sizeMap[size] || sizeMap.md} ${className} select-none transition-transform duration-200`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo officiel authentique ONG AMSHARTE"
    >
      <title>{title}</title>
      <defs>
        <filter id="logo-drop-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.12"/>
        </filter>
      </defs>

      <g filter="url(#logo-drop-shadow)">
        {/* Letter A (Forest Green) */}
        <text 
          x="35" 
          y="145" 
          fontFamily="'Times New Roman', 'Baskerville', 'Playfair Display', Georgia, serif" 
          fontSize="160" 
          fontWeight="bold" 
          fill="#357A38" 
          letterSpacing="-2"
        >
          A
        </text>

        {/* Letter S (Warm Ochre / Orange) */}
        <text 
          x="140" 
          y="145" 
          fontFamily="'Times New Roman', 'Baskerville', 'Playfair Display', Georgia, serif" 
          fontSize="160" 
          fontWeight="bold" 
          fill="#EB8333" 
          letterSpacing="-2"
        >
          S
        </text>

        {/* Letter R (Coral Red / Crimson) */}
        <text 
          x="235" 
          y="145" 
          fontFamily="'Times New Roman', 'Baskerville', 'Playfair Display', Georgia, serif" 
          fontSize="160" 
          fontWeight="bold" 
          fill="#DE3426" 
          letterSpacing="-2"
        >
          R
        </text>

        {/* Solid Horizontal Crossbar traversing A, S and R */}
        <rect 
          x="110" 
          y="94" 
          width="130" 
          height="9" 
          fill="#0A0A0A" 
          rx="1" 
        />

        {/* Radiating Red Rays / Fan of Sparks from the wand tip */}
        <g stroke="#DE3426" strokeWidth="4.5" strokeLinecap="round">
          <line x1="358" y1="98" x2="368" y2="76" />
          <line x1="363" y1="102" x2="382" y2="84" />
          <line x1="367" y1="107" x2="394" y2="95" />
          <line x1="368" y1="113" x2="399" y2="109" />
          <line x1="366" y1="120" x2="395" y2="124" />
          <line x1="362" y1="126" x2="387" y2="137" />
          <line x1="357" y1="131" x2="373" y2="149" />
        </g>

        {/* Wand / Rod (Black diagonal line with rounded cap) */}
        <line 
          x1="250" 
          y1="200" 
          x2="350" 
          y2="108" 
          stroke="#0A0A0A" 
          strokeWidth="8" 
          strokeLinecap="round" 
        />

        {/* Bottom Text: ONG AMSHARTE (Solid Black Sans-Serif) */}
        <text 
          x="20" 
          y="196" 
          fontFamily="'Arial Black', 'Montserrat', 'Inter', -apple-system, sans-serif" 
          fontSize="29" 
          fontWeight="900" 
          fill="#0A0A0A" 
          letterSpacing="1"
        >
          ONG AMSHARTE
        </text>
      </g>
    </svg>
  );

  if (withContainer) {
    return (
      <div 
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        className={`bg-white rounded-2xl p-2 sm:p-2.5 shadow-sm border border-slate-200/90 flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-emerald-400/80 transition-all group' : ''}`}
        title={title}
      >
        {svgContent}
      </div>
    );
  }

  if (onClick) {
    return (
      <div 
        onClick={onClick}
        role="button"
        tabIndex={0}
        className="inline-flex items-center cursor-pointer transition-transform hover:scale-105"
        title={title}
      >
        {svgContent}
      </div>
    );
  }

  return svgContent;
};
