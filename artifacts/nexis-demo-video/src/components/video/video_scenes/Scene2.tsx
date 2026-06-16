import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200), // bg nodes appear
      setTimeout(() => setPhase(2), 600), // title 
      setTimeout(() => setPhase(3), 1200), // stats stagger
      setTimeout(() => setPhase(4), 3000), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-20 z-10"
      {...sceneTransitions.splitVertical}
    >
      
      {/* Midground: Scattered Data Nodes */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-error rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={phase >= 1 ? { scale: [1, 2, 1], opacity: [0, 0.8, 0.2] } : {}}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatType: 'reverse' }}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl grid grid-cols-2 gap-16 items-center">
        <div>
          <motion.h2 
            className="text-6xl font-display font-bold leading-tight"
            initial={{ opacity: 0, x: -50 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Risk is <span className="text-error">everywhere.</span><br/>
            Clarity is rare.
          </motion.h2>
          <motion.p 
            className="text-xl text-text-secondary mt-6 max-w-lg"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Fragmented data, regulatory pressure, and blind spots expose the enterprise.
          </motion.p>
        </div>

        <div className="space-y-6">
          {[
            { label: 'Unmitigated Critical Risks', val: '47%' },
            { label: 'Siloed Compliance Data', val: '82%' },
            { label: 'Regulatory Fines YTD', val: '$2.4M' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              className="bg-secondary/50 border border-white/5 p-6 rounded-2xl flex justify-between items-center backdrop-blur-md"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={phase >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.6, delay: i * 0.15, type: 'spring' }}
            >
              <span className="text-lg text-text-secondary">{stat.label}</span>
              <span className="text-3xl font-mono text-error font-bold">{stat.val}</span>
            </motion.div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
