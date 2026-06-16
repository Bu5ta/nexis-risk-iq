import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

const BASE = import.meta.env.BASE_URL;

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),  // NEXIS logo
      setTimeout(() => setPhase(2), 900),  // Partnership lockup
      setTimeout(() => setPhase(3), 1600), // Trust text
      setTimeout(() => setPhase(4), 2400), // CTA
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
        className="flex items-center gap-4 mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <img
          src={`${BASE}images/nexis-icon.svg`}
          alt="NEXIS"
          className="w-14 h-14 drop-shadow-[0_0_20px_rgba(0,212,255,0.7)]"
        />
        <h1 className="text-6xl font-display font-bold tracking-tight text-white">
          NEXIS <span className="font-light text-accent">Risk-IQ</span>
        </h1>
      </motion.div>

      {/* Partnership Lockup */}
      <motion.div
        className="flex items-center gap-5 mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <span className="text-sm text-white/40 tracking-widest uppercase font-mono">
          In Partnership With
        </span>

        {/* Thin divider */}
        <div className="w-px h-8 bg-white/20" />

        {/* RiskInteg logo — cropped from brochure on white card */}
        <div
          className="bg-white rounded-xl overflow-hidden shadow-[0_0_24px_rgba(255,255,255,0.12)]"
          style={{ width: 220, height: 62 }}
        >
          <img
            src={`${BASE}images/riskinteg-brochure.jpg`}
            alt="RiskInteg Solution Services"
            style={{
              width: 500,
              height: 'auto',
              marginTop: -9,
              marginLeft: -9,
            }}
          />
        </div>
      </motion.div>

      {/* Trust Text */}
      <motion.p
        className="text-xl text-text-secondary max-w-2xl text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Trusted by Government, Parastatal &amp; Private Sector organizations worldwide.
      </motion.p>

      {/* Demo CTA */}
      <motion.div
        className="px-8 py-4 bg-white text-[#0F172A] rounded-full font-bold text-lg cursor-default shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={phase >= 4 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        whileHover={{ scale: 1.05 }}
      >
        Request an Executive Demo
      </motion.div>
    </motion.div>
  );
}
