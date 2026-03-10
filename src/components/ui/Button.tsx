import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-semibold rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl hover:scale-105 focus-visible:ring-blue-500 active:scale-95',
    secondary: 'bg-gray-200/80 backdrop-blur text-gray-900 hover:bg-gray-300 shadow-md hover:shadow-lg focus-visible:ring-gray-500 active:scale-95',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl hover:scale-105 focus-visible:ring-red-500 active:scale-95',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm font-medium',
    md: 'px-6 py-3 text-base font-semibold',
    lg: 'px-8 py-4 text-lg font-bold',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block animate-spin">⌛</span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
