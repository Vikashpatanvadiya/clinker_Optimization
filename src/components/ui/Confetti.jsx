import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Confetti = ({ trigger, duration = 3000 }) => {
  const [particles, setParticles] = useState([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][
          Math.floor(Math.random() * 7)
        ],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 4
      }));
      
      setParticles(newParticles);

      // Clear after duration
      const timer = setTimeout(() => {
        setIsActive(false);
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: -20,
              rotate: 0,
              opacity: 1
            }}
            animate={{
              y: '110vh',
              rotate: particle.rotation + 720,
              opacity: [1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5 + Math.random(),
              delay: particle.delay,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Confetti;
