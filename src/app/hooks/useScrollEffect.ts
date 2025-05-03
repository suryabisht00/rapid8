import { useState, useEffect } from 'react';

interface ScrollState {
  scrollY: number;
  isScrolled: boolean;
  scrollPercentage: number;
}

export default function useScrollEffect(threshold = 50) {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    isScrolled: false,
    scrollPercentage: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isScrolled = scrollY > threshold;
      
      // Calculate scroll percentage
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollY / (documentHeight - windowHeight)) * 100;
      
      setScrollState({
        scrollY,
        isScrolled,
        scrollPercentage
      });
      
      // Reveal elements on scroll
      const reveals = document.querySelectorAll('.reveal');
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Call once on mount to initialize
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrollState;
} 