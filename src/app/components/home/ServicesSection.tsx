'use client';

import Link from 'next/link';
import { FaAmbulance, FaHeartbeat, FaHospital } from 'react-icons/fa';
import ServiceCard from './ServiceCard';

interface ServicesSectionProps {
  className?: string;
}

const services = [
  { 
    icon: FaAmbulance, 
    title: "Emergency Ambulance", 
    description: "24/7 emergency ambulance services with trained medical professionals and advanced life support equipment." 
  },
  { 
    icon: FaHeartbeat, 
    title: "Real-time Tracking", 
    description: "Track the status and location of emergency responders in real-time with our advanced GPS tracking system." 
  },
  { 
    icon: FaHospital, 
    title: "Hospital Network", 
    description: "Access to a broad network of hospitals and healthcare facilities ready to provide immediate care." 
  },
];

export default function ServicesSection({ className = '' }: ServicesSectionProps) {
  return (
    <section className={`py-20 px-4 relative z-10 bg-white ${className}`}>
      <div className="container mx-auto">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Our Healthcare Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive healthcare solutions designed to meet your needs with state-of-the-art technology and compassionate care.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              delay={index * 150}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center reveal">
          <Link href="/signin">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 
              shadow-lg transition-all transform hover:-translate-y-1">
              Access Your Healthcare Account
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
} 