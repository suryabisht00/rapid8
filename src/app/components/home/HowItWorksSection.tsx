'use client';

import StepCard from './StepCard';

interface HowItWorksSectionProps {
  className?: string;
}

const steps = [
  { number: "01", title: "Press SOS", description: "Activate emergency response with a single tap on the SOS button" },
  { number: "02", title: "Share Location", description: "Your precise location is automatically shared with emergency responders" },
  { number: "03", title: "Help Dispatched", description: "The nearest medical team is immediately dispatched to your location" },
  { number: "04", title: "Real-time Updates", description: "Receive real-time updates on the status of emergency assistance" },
];

export default function HowItWorksSection({ className = '' }: HowItWorksSectionProps) {
  return (
    <section className={`py-20 px-4 relative z-10 bg-gray-50 ${className}`}>
      <div className="container mx-auto">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our emergency response system is designed to provide the fastest possible assistance
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 