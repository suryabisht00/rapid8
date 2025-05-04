"use client";

interface SosButtonProps {
  onClick: () => void;
  size?: "sm" | "md" | "lg";
}

export default function SosButton({ onClick, size = "lg" }: SosButtonProps) {
  const sizeClasses = {
    sm: "w-24 h-24 text-2xl",
    md: "w-32 h-32 text-4xl",
    lg: "w-44 h-44 text-5xl",
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Multi-layer ripple waves */}
      <div
        className={`absolute ${sizeClasses[size]} rounded-full bg-red-500 opacity-40 animate-ping z-0`}
      />
      <div
        className={`absolute ${sizeClasses[size]} rounded-full bg-red-500 opacity-30 animate-ping delay-200 z-0`}
      />
      <div
        className={`absolute ${sizeClasses[size]} rounded-full bg-red-500 opacity-20 animate-ping delay-500 z-0`}
      />

      {/* Main SOS Button */}
      <button
        onClick={onClick}
        className={`
          ${sizeClasses[size]} 
          relative z-10
          rounded-full 
          flex items-center justify-center 
          font-black 
          text-white 
          bg-gradient-to-br from-red-500 via-red-600 to-red-800 
          shadow-[0_0_25px_5px_rgba(255,0,0,0.5)] 
          border-4 border-white 
          hover:scale-110 
          hover:shadow-[0_0_40px_10px_rgba(255,0,0,0.7)] 
          active:scale-95 
          transition-transform duration-300 ease-in-out
          focus:outline-none 
          ring-4 ring-red-500/50 
        `}
        aria-label="Emergency SOS button"
      >
        SOS
      </button>
    </div>
  );
}
