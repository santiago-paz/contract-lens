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
      <text
        x="12"
        y="19"
        textAnchor="middle"
        fontFamily="ui-monospace, 'Geist Mono', SFMono-Regular, Menlo, monospace"
        fontWeight="900"
        fontSize="22"
        fill="currentColor"
      >
        §
      </text>
    </svg>
  );
}
