import React from 'react';

interface GooglePlayBadgeProps {
  href?: string;
  appName?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const GooglePlayLogoIcon: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="none"
  >
    <path
      d="M3.61 1.814L13.793 12 3.61 22.186a1.52 1.52 0 0 1-.46-1.106V2.92c0-.43.17-.822.46-1.106z"
      fill="#00D2FF"
    />
    <path
      d="M17.242 8.55L13.793 12l3.449 3.45 3.896-2.226c.87-.497.87-1.95 0-2.448L17.242 8.55z"
      fill="#FFBC00"
    />
    <path
      d="M3.61 22.186L13.793 12l3.449 3.45-12.164 6.95c-.556.318-1.124.183-1.468-.214z"
      fill="#FF3A44"
    />
    <path
      d="M3.61 1.814c.344-.397.912-.532 1.468-.214l12.164 6.95L13.793 12 3.61 1.814z"
      fill="#00E676"
    />
  </svg>
);

export const GooglePlayBadge: React.FC<GooglePlayBadgeProps> = ({
  href,
  appName,
  size = 'md',
  className = '',
}) => {
  const isCompact = size === 'sm';
  const badgeClasses = `group/play inline-flex items-center ${
    isCompact ? 'gap-2.5 px-3.5 py-1.5 rounded-lg' : 'gap-3 px-4 py-2 rounded-lg'
  } bg-[#0B0D10] text-white border border-white/20 shadow-md hover:bg-black hover:border-rvsgold/70 hover:-translate-y-0.5 transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-rvsgold ${className}`;

  const content = (
    <>
      <GooglePlayLogoIcon className={isCompact ? 'w-5 h-5 shrink-0' : 'w-6 h-6 shrink-0'} />
      <span className="flex flex-col items-start leading-none text-left">
        <span
          className={`${
            isCompact ? 'text-[8px]' : 'text-[9px]'
          } font-semibold uppercase tracking-[0.09em] text-zinc-300`}
        >
          GET IT ON
        </span>
        <span
          className={`${
            isCompact ? 'text-sm' : 'text-[15px]'
          } font-display font-bold tracking-tight text-white mt-0.5`}
        >
          Google Play
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={appName ? `Get ${appName} on Google Play` : 'Get it on Google Play'}
        className={badgeClasses}
      >
        {content}
      </a>
    );
  }

  return <span className={badgeClasses}>{content}</span>;
};
