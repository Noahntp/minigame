import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  highlight?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  highlight = false,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'relative rounded-card p-6 bg-white border-[3px] border-white shadow-candy-md transition-all duration-200 overflow-hidden',
          interactive && 'hover:-translate-y-1 hover:shadow-[0_16px_30px_-8px_rgba(58,46,39,0.28)] cursor-pointer',
          highlight && 'border-candy-brand/50',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
