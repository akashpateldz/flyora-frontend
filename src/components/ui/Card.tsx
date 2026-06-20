import React from 'react';

type CardVariant = 'default' | 'glass' | 'elevated' | 'teal' | 'dark';

interface CardProps {
  variant?: CardVariant;
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border border-flyora-gray-100 shadow-card',
  glass: 'glass shadow-glass',
  elevated: 'bg-white shadow-card-hover border border-flyora-gray-100/50',
  teal: 'bg-gradient-to-br from-flyora-teal/5 to-flyora-teal-light/10 border border-flyora-teal/20',
  dark: 'bg-flyora-navy text-white border border-white/10',
};

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const Card: React.FC<CardProps> = ({
  variant = 'default',
  hover = false,
  children,
  className = '',
  onClick,
  padding = 'md',
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-3xl overflow-hidden
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
