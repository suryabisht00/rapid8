'use client';

import { useEffect } from 'react';
import BackgroundElements from './components/layout/BackgroundElements';
import HeroSection from './components/home/HeroSection';
import ServicesSection from './components/home/ServicesSection';
import HowItWorksSection from './components/home/HowItWorksSection';
import useScrollEffect from './hooks/useScrollEffect';

export default function Home() {
  // Use the scroll effect hook to handle scroll animations
  const { scrollY, isScrolled } = useScrollEffect();

  // Log effect for analytics or debugging
  useEffect(() => {
    console.log('Page loaded');
    
    // Clean up on component unmount
    return () => {
      console.log('Page unloaded');
    };
  }, []);

  return (
    <main className="min-h-screen bg-healthcare relative">
      {/* Background elements */}
      <BackgroundElements enableGrid={true} enableShapes={true} />
      
      {/* Hero Section with SOS Button */}
      <HeroSection scrollIndicatorVisible={true} />
      
      {/* Services Section */}
      <ServicesSection />
      
      {/* How It Works Section */}
      <HowItWorksSection />
    </main>
  );
}