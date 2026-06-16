import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

export const SCENE_DURATIONS: Record<string, number> = {
  intro: 3500,
  problem: 3500,
  dashboard: 5000,
  register: 5000,
  governance: 4000,
  outro: 4000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: Scene1,
  problem: Scene2,
  dashboard: Scene3,
  register: Scene4,
  governance: Scene5,
  outro: Scene6,
};

const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let cumulativeMs = 0;
  for (const [key, ms] of Object.entries(SCENE_DURATIONS)) {
    out[key] = cumulativeMs / 1000;
    cumulativeMs += ms;
  }
  return out;
})();

const gridPositions = [
  { x: '0%', y: '0%', scale: 1, opacity: 0.1 },
  { x: '-10%', y: '-10%', scale: 1.2, opacity: 0.15 },
  { x: '10%', y: '-5%', scale: 1.1, opacity: 0.05 },
  { x: '-5%', y: '10%', scale: 1.3, opacity: 0.1 },
  { x: '0%', y: '5%', scale: 1, opacity: 0.2 },
  { x: '0%', y: '0%', scale: 1, opacity: 0.05 },
];

const AUDIO_SEEK_EPSILON_SEC = 0.18;

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
      audio.currentTime = targetTime;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0F172A]">

      {/* Persistent Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }}
          animate={{
            x: ['-20%', '50%', '10%'],
            y: ['10%', '-30%', '40%'],
            scale: [1, 1.2, 0.8]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-[80px] right-0 bottom-0"
          style={{ background: 'radial-gradient(circle, #60A5FA, transparent)' }}
          animate={{
            x: ['10%', '-40%', '20%'],
            y: ['-10%', '-50%', '10%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Shifting Mesh Grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transformOrigin: 'center',
          }}
          animate={gridPositions[sceneIndex] ?? gridPositions[0]}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Persistent Midground Abstract Nodes */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-accent glow-blue"
        animate={{
          x: ['20vw', '80vw', '50vw', '10vw', '90vw', '50vw'][sceneIndex],
          y: ['30vh', '70vh', '20vh', '80vh', '40vh', '50vh'][sceneIndex],
          scale: [1, 2, 1.5, 0.5, 1, 0][sceneIndex],
          opacity: sceneIndex === 5 ? 0 : 0.6,
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent"
        animate={{
          left: ['10%', '0%', '20%', '-10%', '15%', '0%'][sceneIndex],
          top: ['60%', '40%', '80%', '30%', '70%', '50%'][sceneIndex],
          width: ['30%', '100%', '60%', '120%', '40%', '0%'][sceneIndex],
          opacity: sceneIndex === 5 ? 0 : 0.3,
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Foreground Scenes */}
      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      {/* Background music — scene-synced */}
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </div>
  );
}
