import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundParticlesProps {
  mousePos: { x: number; y: number };
}

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ mousePos }) => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* 1. Dot Grid Backdrop Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.5] dark:opacity-[0.25]" />
      
      {/* 2. Parallax Wrapper for Large Glowing Blobs */}
      <motion.div 
        className="absolute inset-0"
        animate={{ 
          x: mousePos.x * -70, 
          y: mousePos.y * -70 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 45, 
          damping: 25 
        }}
      >
        {/* Colorful Flowing Aurora Wave Themes */}
        <div className="aurora-container">
          <div className="aurora-wave aurora-wave-1" />
          <div className="aurora-wave aurora-wave-2" />
          <div className="aurora-wave aurora-wave-3" />
          <div className="aurora-wave aurora-wave-4" />
        </div>
      </motion.div>

      {/* 3. Twinkling Float Particles (Gently drifting up) */}
      <div className="absolute inset-0 opacity-[0.25] dark:opacity-[0.15]">
        {[...Array(20)].map((_, i) => {
          const size = Math.random() * 4 + 2;
          const left = `${Math.random() * 100}%`;
          const top = `${Math.random() * 100}%`;
          const delay = Math.random() * 5;
          const duration = Math.random() * 10 + 10;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary"
              style={{
                width: size,
                height: size,
                left,
                top,
                filter: 'drop-shadow(0 0 4px var(--color-primary))',
              }}
              animate={{
                y: [0, -120, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0.15, 0.85, 0.15],
                scale: [0.75, 1.25, 0.75],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BackgroundParticles;
