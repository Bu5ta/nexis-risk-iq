import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

const BASE = import.meta.env.BASE_URL;

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),  // logo mark
      setTimeout(() => setPhase(2), 800),  // NEXIS text
      setTimeout(() => setPhase(3), 1400), // Risk-IQ text
      setTimeout(() => setPhase(4), 2000), // Tagline
      setTimeout(() => setPhase(5), 2700), // Partnership strip
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      {...sceneTransitions.fadeBlur}
    >
      <div className="flex items-center gap-6 mb-6">
        {/* NEXIS Icon */}
        <motion.div
          className="relative w-24 h-24 flex items-center justify-center"
          initial={{ scale: 0, rotate: -90 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="absolute inset-0 rounded-xl opacity-30 blur-xl"
            style={{ background: 'radial-gradient(circle, #00D4FF, transparent)' }} />
          <img
            src={`${BASE}images/nexis-icon.svg`}
            alt="NEXIS"
            className="w-20 h-20 drop-shadow-[0_0_16px_rgba(0,212,255,0.6)]"
          />
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
        className="overflow-hidden mb-10"
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

      {/* Strategic Partnership strip */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={phase >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <span className="text-xs text-white/40 tracking-widest uppercase font-mono">Strategic Partnership</span>
        <div className="flex items-center gap-4">
          {/* RiskInteg logo — clean square display */}
          <div
            className="bg-white rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center"
            style={{ width: 80, height: 80 }}
          >
            <img
              src={`${BASE}images/riskinteg-logo.jpg`}
              alt="RiskInteg Solution Services"
              style={{ width: 80, height: 80, objectFit: 'contain' }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-wide">RiskInteg Solution Services</span>
            <span className="text-sm text-white/50 font-mono">Delivering NEXIS Risk-IQ to the market</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
