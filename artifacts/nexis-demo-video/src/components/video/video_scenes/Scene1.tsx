import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300), // logo mark
      setTimeout(() => setPhase(2), 800), // NEXIS text
      setTimeout(() => setPhase(3), 1400), // Risk-IQ text
      setTimeout(() => setPhase(4), 2000), // Tagline
      setTimeout(() => setPhase(5), 3000), // Exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      {...sceneTransitions.fadeBlur}
    >
      <div className="flex items-center gap-6 mb-6">
        {/* Logo Mark */}
        <motion.div
          className="relative w-24 h-24 flex items-center justify-center"
          initial={{ scale: 0, rotate: -90 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="absolute inset-0 bg-accent rounded-xl opacity-20 blur-xl"></div>
          <div className="w-16 h-16 bg-gradient-to-tr from-accent-dark to-accent rounded-xl transform rotate-45 flex items-center justify-center shadow-lg border border-white/10">
            <div className="w-6 h-6 bg-white rounded-sm transform -rotate-45"></div>
          </div>
        </motion.div>

        {/* Text */}
        <div className="flex flex-col">
          <div className="flex overflow-hidden h-20 items-end">
            <motion.h1 
              className="text-7xl font-display font-bold tracking-tight text-white leading-none"
              initial={{ y: 80 }}
              animate={phase >= 2 ? { y: 0 } : { y: 80 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              NEXIS
            </motion.h1>
            <motion.span 
              className="text-7xl font-display font-light text-accent ml-4 leading-none"
              initial={{ opacity: 0, x: -20 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              Risk-IQ
            </motion.span>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <motion.div
        className="overflow-hidden"
        initial={{ opacity: 0 }}
        animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
      >
        <motion.p 
          className="text-2xl text-text-secondary font-mono tracking-widest uppercase"
          initial={{ y: -20, filter: 'blur(10px)' }}
          animate={phase >= 4 ? { y: 0, filter: 'blur(0px)' } : { y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Intelligent Risk. Total Clarity.
        </motion.p>
      </motion.div>

    </motion.div>
  );
}
