import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  type?: 'submit' | 'button';
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  icon?: ReactNode;
}

export default function Button({ 
  children, 
  type = 'button', 
  onClick, 
  variant = 'primary',
  className = '',
  icon
}: ButtonProps) {
  const baseStyle = "w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center relative overflow-hidden text-sm sm:text-base";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 shadow-sm hover:shadow",
    outline: "bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      type={type}
      onClick={onClick}
    >
      {/* Ripple effect */}
      <span className="absolute inset-0 overflow-hidden rounded-lg">
        <motion.span 
          className="absolute bg-white w-5 h-5 rounded-full opacity-25"
          initial={{ scale: 0, x: "-50%", y: "-50%" }}
          whileTap={{ scale: 8, opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ 
            left: "calc(var(--mouse-x, 0) * 1px)", 
            top: "calc(var(--mouse-y, 0) * 1px)" 
          }}
        />
      </span>
      
      {/* Button content */}
      <span className="flex items-center justify-center gap-2 z-10">
        {icon && <span>{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
}

