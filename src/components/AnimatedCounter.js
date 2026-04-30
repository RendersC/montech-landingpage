import React, { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

/**
 * Animated number counter — counts up to `to` once it scrolls into view.
 * Supports a suffix string (e.g. "+", "%", "/5", "x") and a custom format.
 */
const AnimatedCounter = ({ to, suffix = '', duration = 1.6, format, className, style }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [displayValue, setDisplayValue] = useState('0');

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration:  duration * 1000,
    bounce:    0,
    stiffness: 60,
    damping:   18,
  });

  useEffect(() => {
    if (inView) motionValue.set(to);
  }, [inView, to, motionValue]);

  useEffect(() => {
    return spring.on('change', (latest) => {
      const value = format ? format(latest) : Math.round(latest).toString();
      setDisplayValue(value);
    });
  }, [spring, format]);

  return (
    <span ref={ref} className={className} style={style}>
      {displayValue}{suffix}
    </span>
  );
};

export default AnimatedCounter;
