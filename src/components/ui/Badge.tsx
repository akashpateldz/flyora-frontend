import React from 'react';

type BadgeVariant = 'teal' | 'navy' | 'blue' | 'success' | 'warning' | 'outline' | 'danger';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  teal: 'bg-flyora-teal/10 text-flyora-teal-dark border border-flyora-teal/20',
  navy: 'bg-flyora-navy text-white border border-transparent',
  blue: 'bg-flyora-blue/10 text-flyora-blue border border-flyora-blue/20',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  outline: 'bg-transparent text-flyora-navy border border-flyora-gray-200',
  danger: 'bg-red-50 text-red-700 border border-red-200',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-1 text-xs gap-1',
  md: 'px-3.5 py-1.5 text-xs gap-1.5',
  lg: 'px-4 py-2 text-sm gap-2',
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'teal',
  size = 'md',
  children,
  icon,
  className = '',
  pulse = false,
}) => {
  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full
        whitespace-nowrap
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${pulse ? 'badge-pulse' : ''}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
