import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className = "text-black", ...props }: LogoProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Handle */}
      <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      {/* Main Body (Suitcase/Book) */}
      <rect x="4" y="6" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="2.5" />
      {/* Spine / Divider */}
      <line x1="10" y1="6" x2="10" y2="22" stroke="currentColor" strokeWidth="2.5" />
      {/* Pages / Lines hint */}
      <line x1="14" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <line x1="14" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <line x1="14" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    </svg>
  );
}
