export default function IadsLogo({ size = 48, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="IADS logo">
      <defs>
        <linearGradient id="g" x1="32" y1="32" x2="224" y2="224">
          <stop offset="0" stopColor="#2563EB"/>
          <stop offset="1" stopColor="#1E40AF"/>
        </linearGradient>
      </defs>
      <circle cx="128" cy="128" r="112" fill="url(#g)"/>
      <path d="M89 82c14-22 47-26 66-10c17-1 31 13 31 30c0 4-1 8-3 12c7 10 7 24-1 34c1 17-12 32-29 34c-12 14-33 16-48 6c-19 3-36-11-36-30c0-5 1-10 3-14c-10-11-9-28 2-38c1-9 6-18 15-24z" fill="#fff" opacity="0.95"/>
      <g stroke="#2563EB" strokeWidth="6" strokeLinecap="round">
        <line x1="128" y1="118" x2="168" y2="98"/>
        <line x1="128" y1="118" x2="118" y2="154"/>
        <line x1="128" y1="118" x2="98"  y2="108"/>
      </g>
      <g fill="#1E40AF" stroke="#FFFFFF" strokeWidth="4">
        <circle cx="128" cy="118" r="10"/>
        <circle cx="168" cy="98"  r="8"/>
        <circle cx="118" cy="154" r="8"/>
        <circle cx="98"  cy="108" r="8"/>
      </g>
    </svg>
  );
}
