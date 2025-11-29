import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading = false,
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 px-4 py-2 text-sm",
    secondary: "bg-gray-800 text-gray-100 hover:bg-gray-700 focus:ring-gray-500 px-4 py-2 text-sm border border-gray-700",
    ghost: "bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white px-3 py-2 text-sm",
    icon: "p-2 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white rounded-full",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};