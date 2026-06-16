import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),  // Logo
      setTimeout(() => setPhase(2), 1200), // Trust text
      setTimeout(() => setPhase(3), 2000), // CTA
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0F172A]"
      {...sceneTransitions.zoomThrough}
    >
      
      {/* Central Logo */}
      <motion.div
        className="flex items-center gap-4 mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="w-16 h-16 bg-gradient-to-tr from-accent-dark to-accent rounded-xl transform rotate-45 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)]">
          <div className="w-6 h-6 bg-white rounded-sm transform -rotate-45"></div>
        </div>
        <h1 className="text-6xl font-display font-bold tracking-tight text-white">
          NEXIS <span className="font-light text-accent">Risk-IQ</span>
        </h1>
      </motion.div>

      {/* Trust Text */}
      <motion.p 
        className="text-xl text-text-secondary max-w-2xl text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Trusted by Government, Parastatal &amp; Private Sector organizations worldwide.
      </motion.p>

      {/* Demo CTA (Visual only) */}
      <motion.div
        className="px-8 py-4 bg-white text-[#0F172A] rounded-full font-bold text-lg cursor-default shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={phase >= 3 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        whileHover={{ scale: 1.05 }}
      >
        Request an Executive Demo
      </motion.div>

    </motion.div>
  );
}
