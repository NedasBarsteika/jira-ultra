'use client';

import { type ButtonHTMLAttributes } from 'react';

type ButtonColor = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'transparent';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'solid' | 'outline';

interface CustomButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  children: React.ReactNode;
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const colorStyles: Record<ButtonColor, Record<ButtonVariant, string>> = {
  primary: {
    solid: 'bg-primary text-primary-foreground hover:bg-primary/70',
    outline:
      'border-primary text-primary hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-blue-500',
  },
  secondary: {
    solid:
      'bg-secondary text-secondary-foreground hover:bg-secondary/70 active:bg-secondary focus-visible:ring-secondary-foreground',
    outline:
      'border-secondary text-secondary hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-gray-500',
  },
  danger: {
    solid: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500',
    outline:
      'border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100 focus-visible:ring-red-500',
  },
  success: {
    solid:
      'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-500',
    outline:
      'border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100 focus-visible:ring-green-500',
  },
  ghost: {
    solid:
      'bg-transparent text-accent hover:bg-accent hover:text-accent-foreground active:bg-accent-foreground focus-visible:ring-accent-foreground',
    outline:
      'border-accent-foreground text-accent hover:bg-accent-foreground active:bg-accent-foreground focus-visible:ring-accent-foreground',
  },
  transparent: {
    solid: 'border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
    outline: 'border text-foreground hover:bg-accent hover:text-accent-foreground',
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

export default function CustomButton({
  children,
  color = 'primary',
  size = 'md',
  variant = 'solid',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...rest
}: CustomButtonProps) {
  const isDisabled = disabled || loading;

  const baseStyles =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive';
  const variantBase = variant === 'outline' ? 'border-2 bg-transparent' : '';
  const disabledStyles = isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  const widthStyles = fullWidth ? 'w-full' : '';

  const classes = [
    baseStyles,
    variantBase,
    colorStyles[color][variant],
    sizeStyles[size],
    disabledStyles,
    widthStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={isDisabled} onClick={onClick} {...rest}>
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {icon && !loading && iconPosition === 'left' && icon}
      {children}
      {icon && !loading && iconPosition === 'right' && icon}
    </button>
  );
}
