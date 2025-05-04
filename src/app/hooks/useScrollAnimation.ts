import { useState, useEffect, RefObject } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  animateOnScroll?: boolean;
}

export function useScrollAnimation(
  ref: RefObject<HTMLElement | null>,
  options: ScrollAnimationOptions = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // Add a class to body for mobile styles
    document.body.classList.add('emergency-page');
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || '0px',
      }
    );
    
    observer.observe(element);
    
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    
    if (options.animateOnScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      observer.unobserve(element);
      document.body.classList.remove('emergency-page');
      if (options.animateOnScroll) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [ref, options]);
  
  return { isVisible, hasScrolled };
}
