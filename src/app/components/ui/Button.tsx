import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant: "primary" | "secondary" | "outline" | "danger";
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean; // Add the disabled property
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  variant,
  icon,
  onClick,
  className = "",
  disabled = false, // Add default value
}) => {
  // Base button styles
  const baseStyles = "flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200";
  
  // Variant specific styles
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:text-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400",
  };
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={onClick}
      disabled={disabled} // Add the disabled attribute
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
