import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),  // UI shell
      setTimeout(() => setPhase(2), 600),  // Sidebar
      setTimeout(() => setPhase(3), 1000), // KPI Cards
      setTimeout(() => setPhase(4), 1800), // Charts
      setTimeout(() => setPhase(5), 4500), // Exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10"
      {...sceneTransitions.morphExpand}
    >
      <div className="w-[90vw] h-[85vh] bg-[#0B1120] rounded-2xl border border-white/10 shadow-2xl flex overflow-hidden">
        
        {/* Sidebar */}
        <motion.div 
          className="w-64 bg-[#0F172A] border-r border-white/5 p-6 flex flex-col gap-8"
          initial={{ x: -100, opacity: 0 }}
          animate={phase >= 2 ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="text-xl font-display font-bold text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded-sm"></div>
            NEXIS
          </div>
          <div className="space-y-4">
            {['Dashboard', 'Risk Register', 'Compliance', 'Audit Trail', 'Reports'].map((item, i) => (
              <div key={i} className={`h-8 rounded md flex items-center px-3 text-sm ${i===0 ? 'bg-accent/20 text-accent' : 'text-text-muted'}`}>
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-10 flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={phase >= 2 ? { opacity: 1 } : {}}
            className="flex justify-between items-end"
          >
            <div>
              <h2 className="text-3xl font-display font-bold">Executive Dashboard</h2>
              <p className="text-text-secondary mt-1">Multi-tenant view: Apex Financial Services Group</p>
            </div>
            <div className="px-4 py-2 bg-accent/10 text-accent rounded border border-accent/20 text-sm">
              Live Feed Active
            </div>
          </motion.div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Compliance Rate', val: '94.2%', col: 'text-success' },
              { label: 'High-Risk Items', val: '12', col: 'text-error' },
              { label: 'Overdue Actions', val: '3', col: 'text-warning' },
              { label: 'Appetite Breaches', val: '0', col: 'text-text-primary' }
            ].map((kpi, i) => (
              <motion.div 
                key={i}
                className="bg-[#1E293B] border border-white/5 rounded-xl p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-sm text-text-muted">{kpi.label}</div>
                <div className={`text-3xl font-mono mt-2 font-bold ${kpi.col}`}>{kpi.val}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Area */}
          <div className="flex-1 grid grid-cols-3 gap-6">
            <motion.div 
              className="col-span-2 bg-[#1E293B] border border-white/5 rounded-xl p-5 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-sm font-semibold mb-6">Risk by Department</div>
              <div className="absolute bottom-5 left-5 right-5 h-48 flex items-end gap-4">
                {[40, 70, 30, 90, 50, 20, 60, 80].map((h, i) => (
                  <motion.div 
                    key={i}
                    className="flex-1 bg-accent/80 rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={phase >= 4 ? { height: `${h}%` } : { height: 0 }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="col-span-1 bg-[#1E293B] border border-white/5 rounded-xl p-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-sm font-semibold mb-6">Risk Profile</div>
              <div className="flex justify-center items-center h-48">
                <motion.div 
                  className="w-40 h-40 rounded-full border-8 border-t-error border-r-warning border-b-success border-l-success"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={phase >= 4 ? { rotate: 45, opacity: 1 } : { rotate: -180, opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
