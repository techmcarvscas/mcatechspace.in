import React from 'react';

interface LogoMarkProps {
  brandName: string;
  subLabel?: string;
  variant?: 'light' | 'dark';
  compact?: boolean;
}

export const LogoMark: React.FC<LogoMarkProps> = ({
  brandName,
  subLabel = 'RVS · MCA',
  variant = 'light',
  compact = false,
}) => {
  const isLight = variant === 'light';

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-md bg-rvsmaroon border border-rvsgold/40 shadow-sm">
        <svg
          width="22"
          height="22"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
        >
          <path
            d="M4 21V7L11 15.5L18 7V21"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 9.5L25 14L21 18.5"
            stroke="#FAAE53"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`font-display text-sm sm:text-base font-bold tracking-[0.03em] ${
            isLight ? 'text-rvsslate' : 'text-white'
          }`}
        >
          {brandName}
        </span>
        {!compact && (
          <span
            className={`mt-1 text-[10px] sm:text-[11px] tracking-[0.04em] ${
              isLight ? 'text-rvsmaroon font-semibold' : 'text-rvsgold font-medium'
            }`}
          >
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
};
