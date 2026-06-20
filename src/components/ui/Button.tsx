import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'teal';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-flyora-navy to-flyora-navy-light
    text-white font-semibold
    shadow-[0_4px_15px_rgba(10,22,40,0.3)]
    hover:shadow-[0_8px_25px_rgba(10,22,40,0.4)]
    hover:-translate-y-0.5 hover:from-flyora-navy-medium hover:to-flyora-navy
  `,
  teal: `
    bg-gradient-to-r from-flyora-teal to-flyora-teal-light
    text-white font-semibold
    shadow-[0_4px_15px_rgba(13,148,136,0.35)]
    hover:shadow-[0_8px_25px_rgba(13,148,136,0.45)]
    hover:-translate-y-0.5
  `,
  secondary: `
    bg-white text-flyora-navy font-semibold
    border-2 border-flyora-gray-200
    hover:border-flyora-teal hover:text-flyora-teal
    hover:-translate-y-0.5 hover:shadow-card
  `,
  outline: `
    bg-transparent text-white font-semibold
    border-2 border-white/60
    hover:bg-white/10 hover:border-white
    hover:-translate-y-0.5
  `,
  ghost: `
    bg-transparent text-flyora-navy font-medium
    hover:bg-flyora-gray-50 hover:text-flyora-teal
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
  xl: 'px-8 py-4 text-base rounded-2xl gap-2.5',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        transition-all duration-300 ease-out
        select-none cursor-pointer
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
};

export default Button;
