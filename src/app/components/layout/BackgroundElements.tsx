'use client';

interface BackgroundElementsProps {
  enableGrid?: boolean;
  enableShapes?: boolean;
}

export default function BackgroundElements({
  enableGrid = true,
  enableShapes = true
}: BackgroundElementsProps) {
  return (
    <>
      {enableGrid && <div className="medical-grid"></div>}
      
      {enableShapes && (
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      )}
    </>
  );
} 