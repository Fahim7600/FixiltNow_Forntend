import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export type NeonButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type NeonButtonSize = 'sm' | 'md' | 'lg';

export interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NeonButtonVariant;
  size?: NeonButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function NeonButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: NeonButtonProps) {
  const sizeStyles: Record<NeonButtonSize, string> = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5 rounded-lg',
    md: 'px-5 py-2.5 text-sm font-semibold gap-2 rounded-xl',
    lg: 'px-7 py-3.5 text-base font-bold gap-2.5 rounded-xl',
  };

  const variantStyles: Record<NeonButtonVariant, string> = {
    primary: `
      relative text-amber-50 bg-[#1a1510] border border-[#f59e0b]/40 
      shadow-[0_0_12px_rgba(245,158,11,0.2)] 
      hover:border-[#fbbf24] hover:shadow-[0_0_24px_rgba(251,191,36,0.45)] hover:text-white
      before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] 
      before:bg-gradient-to-r before:from-[#b45309]/20 before:via-[#f59e0b]/20 before:to-[#fbbf24]/20 
      hover:before:from-[#b45309]/40 hover:before:via-[#f59e0b]/40 hover:before:to-[#fbbf24]/40
    `,
    secondary: `
      relative text-teal-50 bg-[#0f1716] border border-[#14b8a6]/40 
      shadow-[0_0_12px_rgba(20,184,166,0.2)] 
      hover:border-[#5eead4] hover:shadow-[0_0_24px_rgba(94,234,212,0.45)] hover:text-white
      before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] 
      before:bg-gradient-to-r before:from-[#0f766e]/20 before:via-[#14b8a6]/20 before:to-[#5eead4]/20 
      hover:before:from-[#0f766e]/40 hover:before:via-[#14b8a6]/40 hover:before:to-[#5eead4]/40
    `,
    danger: `
      relative text-red-100 bg-[#1c1212] border border-[#dc2626]/40 
      shadow-[0_0_12px_rgba(220,38,38,0.2)] 
      hover:border-[#f87171] hover:shadow-[0_0_24px_rgba(248,113,113,0.45)] hover:text-white
      before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] 
      before:bg-gradient-to-r before:from-[#991b1b]/20 before:via-[#dc2626]/20 before:to-[#f87171]/20 
      hover:before:from-[#991b1b]/40 hover:before:via-[#dc2626]/40 hover:before:to-[#f87171]/40
    `,
    ghost: `
      relative text-[#d4ceb8] bg-transparent border border-transparent 
      hover:bg-[#221e1a]/70 hover:text-[#fbbf24] hover:border-[#f59e0b]/30
      hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]
    `,
  };

  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`
        group inline-flex items-center justify-center font-heading tracking-wide transition-all duration-300
        active:scale-[0.98] hover:-translate-y-0.5
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
        overflow-hidden cursor-pointer
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {/* Background Spark Particle Overlay (Animates on group hover) */}
      {!isDisabled && variant !== 'ghost' && (
        <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg
            className="absolute top-1 left-2 w-2.5 h-2.5 text-[#fbbf24] animate-spark"
            style={{ '--spark-x': '12px', '--spark-y': '-12px' } as React.CSSProperties}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <svg
            className="absolute bottom-1.5 right-3 w-2 h-2 text-[#f59e0b] animate-spark"
            style={{ '--spark-x': '-10px', '--spark-y': '-16px', animationDelay: '0.2s' } as React.CSSProperties}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </span>
      )}

      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : icon ? (
        <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">{icon}</span>
      ) : null}

      <span className="relative z-10">{children}</span>
    </button>
  );
}
