import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 transition-all duration-300 ${className}`}
    >
      {/* SVG Icon with copper gradient fill & warm glow effect */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.4)] group-hover:drop-shadow-[0_0_14px_rgba(251,191,36,0.7)]"
        >
          <defs>
            <linearGradient id="logo-copper-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="logo-badge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#221e1a" />
              <stop offset="100%" stopColor="#181512" />
            </linearGradient>
          </defs>

          {/* Hexagonal Shield Background */}
          <path
            d="M20 2L35 10.5V29.5L20 38L5 29.5V10.5L20 2Z"
            fill="url(#logo-badge-gradient)"
            stroke="url(#logo-copper-gradient)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Stylized Wrench / Tool Motif */}
          <path
            d="M16 13C16 11.3431 17.3431 10 19 10C20.6569 10 22 11.3431 22 13V15.5H16V13Z"
            fill="url(#logo-copper-gradient)"
          />
          <path
            d="M14 16H26C27.1046 16 28 16.8954 28 18V20C28 21.1046 27.1046 22 26 22H14C12.8954 22 12 21.1046 12 20V18C12 16.8954 12.8954 16 14 16Z"
            fill="url(#logo-copper-gradient)"
          />
          <path
            d="M17.5 22H22.5V29C22.5 30.3807 21.3807 31.5 20 31.5C18.6193 31.5 17.5 30.3807 17.5 29V22Z"
            fill="url(#logo-copper-gradient)"
          />
          {/* Spark/Bolt Detail inside Wrench */}
          <circle cx="20" cy="19" r="2" fill="#12100e" />
        </svg>
      </div>

      {/* Brand Text */}
      <span className={`font-bold tracking-tight font-heading ${textSizes[size]}`}>
        <span className="bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent group-hover:brightness-110">
          Fix
        </span>
        <span className="text-[#f5f2eb]">It</span>
        <span className="text-[#fbbf24] font-medium">Now</span>
      </span>
    </Link>
  );
}
