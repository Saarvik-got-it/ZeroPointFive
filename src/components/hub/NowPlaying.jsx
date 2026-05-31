import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Pause, Play, SkipBack, SkipForward, Volume2, X } from 'lucide-react';

export default function NowPlaying() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(45);
  const [volume, setVolume] = useState(70);
  const waveHeights = useMemo(() => Array.from({ length: 120 }, (_, index) => 30 + Math.sin(index * 0.15) * 30 + Math.sin(index * 0.08) * 20 + Math.sin(index * 0.3) * 15), []);

  return (
    <div className="fixed bottom-0 left-64 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-[#FF7A1A]/20">
      <div className="flex items-center gap-6 px-8 py-4">
        <div className="flex items-center gap-3 w-64">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
            <img src="https://i.pravatar.cc/48?img=15" alt="Dr. James Reed" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[#FAFAF8] font-semibold text-sm mb-1 line-clamp-1">Quantum Leap in AI</h4>
            <p className="text-[#9C9C9C] text-xs line-clamp-1">Dr. James Reed</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-0.5 h-12 cursor-pointer group">
            {waveHeights.map((baseHeight, i) => {
              const isPast = i < (progress / 100) * waveHeights.length;
              const isNearProgress = Math.abs(i - (progress / 100) * waveHeights.length) < 3;
              return (
                <motion.div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-200 ${isPast ? 'bg-gradient-to-t from-[#FF7A1A] to-[#FF9A3D]' : 'bg-[#9C9C9C]/20 group-hover:bg-[#9C9C9C]/30'}`}
                  style={{ height: `${Math.max(15, Math.min(85, baseHeight))}%`, minWidth: '2px' }}
                  animate={isPlaying ? { scaleY: isNearProgress ? [1, 1.2, 1] : 1 } : { scaleY: isNearProgress ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#9C9C9C] text-xs font-medium whitespace-nowrap">26:24</span>
            <div className="flex-1 relative group">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(event) => setProgress(Number(event.target.value))}
                className="w-full h-1 bg-[#1A1A1A] rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #FF7A1A 0%, #FF9A3D ${progress}%, #1A1A1A ${progress}%, #1A1A1A 100%)` }}
              />
            </div>
            <span className="text-[#9C9C9C] text-xs font-medium whitespace-nowrap">-58:32</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#2A2A2A] flex items-center justify-center transition-colors duration-300">
            <SkipBack className="w-4 h-4 text-[#FAFAF8] fill-current" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF7A1A] to-[#FF9A3D] flex items-center justify-center shadow-lg shadow-[#FF7A1A]/30">
            {isPlaying ? <Pause className="w-5 h-5 text-[#050505] fill-current" /> : <Play className="w-5 h-5 text-[#050505] fill-current ml-0.5" />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#2A2A2A] flex items-center justify-center transition-colors duration-300">
            <SkipForward className="w-4 h-4 text-[#FAFAF8] fill-current" />
          </motion.button>
        </div>

        <div className="flex items-center gap-3 w-32">
          <Volume2 className="w-5 h-5 text-[#9C9C9C]" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="flex-1 h-1 bg-[#1A1A1A] rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #FF7A1A 0%, #FF9A3D ${volume}%, #1A1A1A ${volume}%, #1A1A1A 100%)` }}
          />
        </div>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors duration-300">
          <X className="w-5 h-5 text-[#9C9C9C]" />
        </motion.button>
      </div>
    </div>
  );
}
