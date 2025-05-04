"use client";

interface SosButtonProps {
  onClick: () => void;
  size?: "sm" | "md" | "lg";
}

export default function SosButton({ onClick, size = "lg" }: SosButtonProps) {
  const sizeClasses = {
    sm: "w-20 h-20 text-xl",
    md: "w-28 h-28 text-2xl",
    lg: "w-32 h-32 md:w-40 md:h-40 text-3xl md:text-4xl",
  };

  return (
    <button
      onClick={onClick}
      className={`
        sos-button 
        ${sizeClasses[size]} 
        rounded-full 
        flex items-center justify-center 
        font-extrabold 
        text-white 
        bg-gradient-to-br from-red-600 to-red-800 
        shadow-2xl 
        border-4 border-white 
        hover:scale-105 
        hover:shadow-red-600/70 
        active:scale-95 
        transition-all duration-200 
        focus:outline-none 
        ring-4 ring-red-500/40 
        animate-pulse
        relative z-10
      `}
      aria-label="Emergency SOS button"
    >
      SOS
    </button>
  );
}
