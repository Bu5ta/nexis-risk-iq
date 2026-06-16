import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),  // UI shells
      setTimeout(() => setPhase(2), 800),  // Table rows stagger
      setTimeout(() => setPhase(3), 1800), // AI Panel expands
      setTimeout(() => setPhase(4), 2200), // AI text typing
      setTimeout(() => setPhase(5), 4500), // Exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const tableRows = [
    { id: 'CTRL-092', name: 'Data Encryption at Rest', risk: 'High', stat: 'Failed' },
    { id: 'CTRL-093', name: 'Third-party Vendor Audits', risk: 'Medium', stat: 'Active' },
    { id: 'CTRL-094', name: 'Access Review Log', risk: 'High', stat: 'Active' },
    { id: 'CTRL-095', name: 'Incident Response Plan', risk: 'Low', stat: 'Active' },
  ];

  const aiText = "RiskSight Anomaly Detected: Control CTRL-092 has failed 3 times in the last 48 hours. Recommend immediate escalation to IT Security.";

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center p-20 z-10"
      {...sceneTransitions.slideLeft}
    >
      <div className="w-full h-full flex gap-8">
        
        {/* Risk Register Table */}
        <motion.div 
          className="flex-1 bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col"
          initial={{ opacity: 0, y: 50 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-display font-bold mb-8">Risk & Control Register</h2>
          
          <div className="w-full text-left text-sm text-text-muted mb-4 border-b border-white/5 pb-2 grid grid-cols-4">
            <div>Control ID</div>
            <div className="col-span-2">Description</div>
            <div>Status</div>
          </div>
          
          <div className="flex-1 space-y-4">
            {tableRows.map((row, i) => (
              <motion.div 
                key={i}
                className="grid grid-cols-4 items-center bg-white/5 p-4 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                <div className="font-mono text-accent">{row.id}</div>
                <div className="col-span-2 font-medium">{row.name}</div>
                <div>
                  <span className={`px-2 py-1 rounded text-xs ${row.stat === 'Failed' ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}>
                    {row.stat}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Panel */}
        <motion.div 
          className="w-1/3 bg-gradient-to-b from-[#1E293B] to-accent/10 border border-accent/20 rounded-2xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {/* AI Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-full opacity-20 blur-3xl"></div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-xl font-display font-bold text-accent-light">RiskSight AI</h3>
          </div>

          <div className="bg-black/40 rounded-lg p-5 font-mono text-sm leading-relaxed border border-white/5 h-64">
            {aiText.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.1, delay: i * 0.02 }}
                className={char === '!' || char === '3' || char === 'C' ? 'text-error' : 'text-text-primary'}
              >
                {char}
              </motion.span>
            ))}
          </div>
          
          <motion.div 
            className="mt-6 flex gap-3"
            initial={{ opacity: 0 }}
            animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 2.5 }}
          >
            <div className="px-4 py-2 bg-error text-white rounded text-sm font-semibold">Generate Report</div>
            <div className="px-4 py-2 bg-white/10 rounded text-sm">Dismiss</div>
          </motion.div>

        </motion.div>

      </div>
    </motion.div>
  );
}
