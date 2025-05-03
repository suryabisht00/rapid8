'use client';

interface SosButtonProps {
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function SosButton({ onClick, size = 'lg' }: SosButtonProps) {
  const sizeClasses = {
    sm: 'w-24 h-24 text-2xl',
    md: 'w-32 h-32 text-3xl',
    lg: 'w-40 h-40 text-4xl'
  };

  return (
    <button 
      onClick={onClick}
      className={`sos-button bg-red-600 text-white ${sizeClasses[size]} rounded-full flex items-center justify-center font-bold shadow-lg hover:bg-red-700 transition-colors relative z-10`}
      aria-label="Emergency SOS button"
    >
      SOS
    </button>
  );
} 