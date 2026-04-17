import React, { useEffect, useState, useRef } from 'react';

/**
 * Animated counter that counts up from 0 to the target value
 */
const AnimatedCounter = ({ 
  value, 
  duration = 1500, 
  prefix = '', 
  suffix = '',
  decimals = 0,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);
  const previousValueRef = useRef(0);

  useEffect(() => {
    const startValue = previousValueRef.current;
    const endValue = typeof value === 'number' ? value : 0;
    
    if (startValue === endValue) return;

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (endValue - startValue) * easeOut;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        previousValueRef.current = endValue;
        startTimeRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  const formatValue = (val) => {
    if (decimals > 0) {
      return val.toFixed(decimals);
    }
    return Math.round(val).toLocaleString();
  };

  return (
    <span className={className}>
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  );
};

export default AnimatedCounter;
