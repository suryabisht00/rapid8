import { ChangeEvent, useState } from 'react';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

interface InputProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  Icon: IconType;
}

export default function Input({
  type,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  Icon
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`absolute top-0 left-0 w-full h-full border rounded-lg pointer-events-none transition-all duration-200 ${isFocused ? 'border-blue-500 shadow-sm' : 'border-gray-300'}`}></div>
      
      <Icon className={`absolute top-3 left-3 text-lg transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
      
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full pl-10 pr-4 py-3 bg-transparent rounded-lg focus:outline-none text-gray-800 text-sm sm:text-base"
        required={required}
      />
      
      {(isFocused || value) && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-2.5 left-2 text-xs px-1 bg-white text-blue-500"
        >
          {placeholder}
        </motion.span>
      )}
    </motion.div>
  );
}