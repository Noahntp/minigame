import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  variant?: 'gold' | 'rose' | 'emerald' | 'amber' | 'sapphire' | 'neutral';
  size?: 'sm' | 'md';
  hasDot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'gold',
  size = 'md',
  hasDot = false,
  children,
  className,
}) => {
  const base =
    'inline-flex items-center gap-1.5 font-display font-bold rounded-full select-none';

  const sizes = {
    sm: 'text-[10px] px-2.5 py-1 leading-none',
    md: 'text-xs px-3 py-1.5 leading-tight',
  };

  const variants = {
    gold: 'bg-[#FFF3D6] text-[#946200]',
    rose: 'bg-[#FFE1EC] text-[#C23566]',
    emerald: 'bg-[#DFF7EC] text-[#12805A]',
    amber: 'bg-[#FFE9D6] text-[#B85A1E]',
    sapphire: 'bg-[#E3F3FF] text-[#1D74A8]',
    neutral: 'bg-cream-subtle text-ink-muted',
  };

  const dotColors = {
    gold: 'bg-[#FFC93C]',
    rose: 'bg-candy-valentine',
    emerald: 'bg-candy-noel',
    amber: 'bg-candy-tet',
    sapphire: 'bg-candy-noel-ice',
    neutral: 'bg-ink-faint',
  };

  return (
    <span className={twMerge(clsx(base, sizes[size], variants[variant], className))}>
      {hasDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      <span>{children}</span>
    </span>
  );
};
