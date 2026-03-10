import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3.5 border border-gray-300 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:shadow-lg ${
          error ? 'border-red-500 focus:ring-red-500' : 'hover:border-gray-400'
        } placeholder:text-gray-400 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
