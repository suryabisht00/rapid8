"use client";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  delay?: number;
}

export default function StepCard({
  number,
  title,
  description,
  delay = 0,
}: StepCardProps) {
  return (
    <div
      className="relative p-6 reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-6xl font-bold text-blue-100 absolute -top-4 -left-2 z-0">
        {number}
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
