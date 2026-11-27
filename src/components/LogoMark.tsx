import React from 'react';
import rvsLogo from '../assets/rvs-logo.png';
import rvsLogoWhite from '../assets/rvs-logo-white.png';

interface LogoMarkProps {
  brandName: string;
  subLabel?: string;
  variant?: 'light' | 'dark';
  compact?: boolean;
  logoSize?: 'md' | 'lg';
  collegeTitle?: boolean;
}

export const LogoMark: React.FC<LogoMarkProps> = ({
  brandName,
  subLabel = 'RVS · MCA',
  variant = 'light',
  compact = false,
  logoSize = 'md',
  collegeTitle = false,
}) => {
  const isLight = variant === 'light';
  const sizeClasses =
    logoSize === 'lg'
      ? 'h-12 w-12 sm:h-14 sm:w-14 xl:h-[64px] xl:w-[64px]'
      : 'h-11 w-11 sm:h-12 sm:w-12';

  const logoSrc = isLight ? rvsLogo : rvsLogoWhite;

  return (
    <div className="inline-flex items-center gap-3 sm:gap-3.5 select-none">
      <img
        src={logoSrc}
        alt="RVS College of Arts and Science logo"
        className={`${sizeClasses} object-contain shrink-0`}
      />
      <div className="flex flex-col leading-none">
        <span
          style={collegeTitle ? { fontFamily: "'Clearly', Georgia, serif" } : undefined}
          className={
            collegeTitle
              ? `font-college font-normal text-base sm:text-[21px] lg:text-[22px] xl:text-[26px] 2xl:text-[28px] leading-tight tracking-normal antialiased sm:whitespace-nowrap ${
                  isLight ? 'text-rvsmaroon' : 'text-white'
                }`
              : `font-display text-sm sm:text-base font-bold tracking-[0.03em] ${
                  isLight ? 'text-rvsslate' : 'text-white'
                }`
          }
        >
          {brandName}
        </span>
        {!compact && (
          <span
            className={`${
              collegeTitle
                ? 'mt-0.5 text-xs sm:text-sm xl:text-base font-bold tracking-[0.02em] antialiased whitespace-nowrap'
                : 'mt-1 text-[10px] sm:text-xs font-semibold tracking-[0.04em]'
            } ${
              isLight
                ? collegeTitle
                  ? 'text-rvsslate'
                  : 'text-rvsmaroon'
                : collegeTitle
                  ? 'text-white'
                  : 'text-rvsgold'
            }`}
          >
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
};
