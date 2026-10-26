import React from 'react';
import { useLanguage } from '../../i18n';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  textColor?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  textColor,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const sizeMap = {
    sm: { width: 160, height: 40, brandSize: 16, subSize: 8, emblemScale: 0.7 },
    md: { width: 220, height: 55, brandSize: 21, subSize: 9.5, emblemScale: 0.9 },
    lg: { width: 260, height: 65, brandSize: 24, subSize: 11, emblemScale: 1.05 },
  };

  const { width, height } = sizeMap[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`} dir="ltr">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 60"
        width={width}
        height={height}
        fill="none"
        className="w-full max-w-full h-auto"
        style={{ maxWidth: `${width}px` }}
      >
        <defs>
          <style>
            {`
              .brand-eng { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; fill: ${textColor || '#2C1E1A'}; }
              .brand-sub { font-family: ${isEn ? "'Plus Jakarta Sans'" : "'Tajawal'"}, sans-serif; font-size: ${isEn ? '8.5px' : '10px'}; font-weight: 600; letter-spacing: ${isEn ? '1px' : '1.5px'}; fill: #758A73; }
              .leaf-stroke { stroke: #758A73; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; fill: none; }
              .leaf-fill { fill: #E8EFE6; }
              .heart-accent { fill: #D99B8B; }
            `}
          </style>
        </defs>
        {/* Elegant Botanical Emblem from Stitch */}
        <g transform="translate(8, 6)">
          <circle cx="24" cy="24" r="22" fill="#FAF5EF" stroke="#EFE6DC" strokeWidth="1" />
          {/* Organic Leaf / Sprout Illustration */}
          <path
            d="M24 36 C24 24 16 18 13 15 C20 16 25 21 25 28 C26 21 31 16 38 15 C35 18 27 24 27 36 Z"
            fill="#D99B8B"
            opacity="0.85"
          />
          <path
            d="M24 38 C24 26 18 20 15 17 C21 18 25 23 25 30 C26 23 30 18 36 17 C33 20 26 26 26 38 Z"
            fill="#758A73"
            opacity="0.6"
          />
          {/* Tiny heart/dot */}
          <circle cx="24.5" cy="12" r="2.2" fill="#D99B8B" />
        </g>
        {/* Wordmark */}
        <text x="66" y="32" className="brand-eng" fontSize="22" letterSpacing="0.5">
          Lovely
        </text>
        <text x="135" y="32" className="brand-eng" fontSize="22" fontStyle="italic" fill="#758A73" fontWeight="400">
          SkinCare
        </text>
        {showSubtitle && (
          <text x="67" y="47" className="brand-sub">
            {isEn ? 'AUTHENTIC K-BEAUTY BOUTIQUE' : 'عناية فاخرة لبشرتك • بوتيك أصلي'}
          </text>
        )}
      </svg>
    </div>
  );
};
