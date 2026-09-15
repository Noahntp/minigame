import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useGameStore } from '../../store/useGameStore';
import { sound } from '../../utils/audio';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  onClick,
  children,
  ...props
}) => {
  const soundEnabled = useGameStore((state) => state.soundEnabled);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) {
      sound.playClick(soundEnabled);
      onClick?.(e);
    }
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-display font-bold tracking-wide rounded-full transition-all duration-200 select-none overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-candy-brand/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:translate-y-0.5 active:shadow-none';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 shadow-[0_4px_0_rgba(58,46,39,0.14)]',
    md: 'text-sm px-5 py-2.5 shadow-[0_5px_0_rgba(58,46,39,0.14)]',
    lg: 'text-base px-6 py-3 shadow-[0_6px_0_rgba(58,46,39,0.16)]',
    xl: 'text-base sm:text-lg px-8 py-3.5 shadow-[0_8px_0_rgba(58,46,39,0.16)]',
  };

  const variantStyles = {
    primary: 'bg-candy-brand hover:brightness-105 text-white',
    secondary: 'bg-white text-ink border-2 border-cream-subtle hover:border-candy-brand/30',
    outline: 'bg-transparent border-2 border-candy-brand/50 text-candy-brand hover:bg-candy-brand/10',
    ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-ink/5 shadow-none active:translate-y-0',
    danger: 'bg-[#E23F3F] hover:brightness-105 text-white',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Đang tải...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
