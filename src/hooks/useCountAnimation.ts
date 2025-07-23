import { useState, useEffect, useRef } from 'react';

export const useCountAnimation = (targetValue: number, duration: number = 300) => {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const animationRef = useRef<number>();
  const startValueRef = useRef(targetValue);
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = currentValue;
    startValueRef.current = startValue;
    startTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - (startTimeRef.current || now);
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function для плавности
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const newValue = startValue + (targetValue - startValue) * easeOutCubic;
      setCurrentValue(Math.round(newValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (targetValue !== startValue) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  return currentValue;
};