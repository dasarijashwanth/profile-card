import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Core motion values for tracking absolute mouse positions
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring physics configs for smoothing lag-following outer ring
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable custom cursors on touchscreen devices for native accessibility
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Trigger expanded state if hovering over links, buttons, theme nodes, or cards
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.glass-card') ||
        target.style.cursor === 'pointer';
      
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Lag-following outer ring (inverts background colors using mix-blend-difference) */}
      <motion.div
        className="fixed top-0 left-0 w-5 h-5 rounded-full border border-primary pointer-events-none z-100 mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isHovered ? 2.0 : 1.0,
          backgroundColor: isHovered ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0)',
          borderColor: isHovered ? 'var(--color-primary)' : 'var(--color-primary-glow)',
        }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
      />
      {/* 2. Inner pinpoint dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-primary-glow pointer-events-none z-100 hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: 7,
          translateY: 7,
        }}
      />
    </>
  );
};

export default CustomCursor;
