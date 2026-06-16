import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),  // grid lines
      setTimeout(() => setPhase(2), 800),  // dept cards
      setTimeout(() => setPhase(3), 1500), // audit log
      setTimeout(() => setPhase(4), 3500), // exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center p-20 z-10"
      {...sceneTransitions.clipPolygon}
    >
      <div className="w-full flex justify-between items-end mb-12">
        <motion.h2 
          className="text-5xl font-display font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        >
          Governance Power.
        </motion.h2>
        <motion.p
           className="text-text-secondary text-xl"
           initial={{ opacity: 0 }}
           animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
        >
          Department Intelligence & Audit Trails
        </motion.p>
      </div>

      <div className="w-full grid grid-cols-3 gap-8">
        
        {/* Dept Grid */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {[
            { name: 'Finance', score: '98%', status: 'green' },
            { name: 'IT Security', score: '82%', status: 'yellow' },
            { name: 'Operations', score: '76%', status: 'red' },
            { name: 'HR', score: '94%', status: 'green' }
          ].map((dept, i) => (
            <motion.div 
              key={i}
              className="bg-[#1E293B] border border-white/10 rounded-xl p-6 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
              animate={phase >= 2 ? { opacity: 1, scale: 1, rotateX: 0 } : { opacity: 0, scale: 0.8, rotateX: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.1 }}
              style={{ transformPerspective: 1000 }}
            >
              <div className="text-lg font-bold">{dept.name}</div>
              <div className="text-3xl font-mono mt-2">{dept.score}</div>
              
              <div className="mt-4 h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${dept.status === 'green' ? 'bg-success' : dept.status === 'yellow' ? 'bg-warning' : 'bg-error'}`}
                  initial={{ width: 0 }}
                  animate={phase >= 2 ? { width: dept.score } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Audit Trail */}
        <motion.div 
          className="col-span-1 bg-[#1E293B]/50 border border-white/5 rounded-xl p-6 relative"
          initial={{ opacity: 0, x: 50 }}
          animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-sm uppercase tracking-widest text-accent mb-4 font-bold">Immutable Audit Log</div>
          <div className="space-y-4">
            {[
              { time: '10:42 AM', action: 'Report Generated: Board Pack Q3' },
              { time: '09:15 AM', action: 'Control CTRL-092 escalated to Critical' },
              { time: '08:30 AM', action: 'Policy: Data Privacy signed by CEO' },
            ].map((log, i) => (
              <motion.div 
                key={i}
                className="flex flex-col border-l-2 border-white/10 pl-4 py-1"
                initial={{ opacity: 0, x: -10 }}
                animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: 0.2 + i * 0.2 }}
              >
                <span className="text-xs font-mono text-text-muted">{log.time}</span>
                <span className="text-sm">{log.action}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
