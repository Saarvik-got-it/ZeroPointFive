import { useState, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react';

export default function NowPlaying() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(45);
  const [volume, setVolume] = useState(70);
  const [isDragging, setIsDragging] = useState(false);
  const waveformRef = useRef<HTMLDivElement>(null);

  const currentEpisode = {
    title: 'Quantum Leap in AI',
    guest: 'Dr. James Reed',
    duration: '58:32',
    currentTime: '26:24'
  };

  // Generate wave pattern - creates a smooth wave curve
  const waveHeights = useMemo(() => {
    const bars = 120;
    const heights: number[] = [];

    for (let i = 0; i < bars; i++) {
      // Create a wave pattern using sine
      const wave1 = Math.sin(i * 0.15) * 30;
      const wave2 = Math.sin(i * 0.08) * 20;
      const wave3 = Math.sin(i * 0.3) * 15;
      const noise = (Math.random() - 0.5) * 10;

      // Combine waves for organic feel
      const height = 30 + wave1 + wave2 + wave3 + noise;
      heights.push(Math.max(15, Math.min(85, height)));
    }

    return heights;
  }, []);

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (waveformRef.current) {
      const rect = waveformRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newProgress = (x / rect.width) * 100;
      setProgress(Math.max(0, Math.min(100, newProgress)));
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  return (
    <div className="fixed bottom-0 left-64 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-[#FF7A1A]/20">
      <div className="flex items-center gap-6 px-8 py-4">
        {/* Episode Info with Thumbnail */}
        <div className="flex items-center gap-3 w-64">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
            <img
              src="https://i.pravatar.cc/48?img=15"
              alt={currentEpisode.guest}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[#FAFAF8] font-semibold text-sm mb-1 line-clamp-1">
              {currentEpisode.title}
            </h4>
            <p className="text-[#9C9C9C] text-xs line-clamp-1">
              {currentEpisode.guest}
            </p>
          </div>
        </div>

        {/* Waveform & Seek Section */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Waveform Visualization */}
          <div
            ref={waveformRef}
            onClick={handleWaveformClick}
            className="flex items-center gap-0.5 h-12 cursor-pointer group"
          >
            {waveHeights.map((baseHeight, i) => {
              const isPast = i < (progress / 100) * waveHeights.length;
              const isNearProgress = Math.abs(i - (progress / 100) * waveHeights.length) < 3;

              return (
                <motion.div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-200 ${
                    isPast
                      ? 'bg-gradient-to-t from-[#FF7A1A] to-[#FF9A3D]'
                      : 'bg-[#9C9C9C]/20 group-hover:bg-[#9C9C9C]/30'
                  }`}
                  style={{
                    height: `${baseHeight}%`,
                    minWidth: '2px'
                  }}
                  animate={isPlaying ? {
                    height: [
                      `${baseHeight}%`,
                      `${Math.min(95, baseHeight + (Math.random() * 15))}%`,
                      `${baseHeight}%`
                    ],
                    scaleY: isNearProgress ? [1, 1.2, 1] : 1
                  } : {
                    scaleY: isNearProgress ? 1.1 : 1
                  }}
                  transition={{
                    height: {
                      duration: 0.8 + (Math.random() * 0.4),
                      repeat: isPlaying ? Infinity : 0,
                      repeatType: 'reverse',
                      ease: 'easeInOut'
                    },
                    scaleY: {
                      duration: 0.3
                    }
                  }}
                  whileHover={{
                    scaleY: 1.15,
                    transition: { duration: 0.2 }
                  }}
                />
              );
            })}
          </div>

          {/* Seek Slider & Time */}
          <div className="flex items-center gap-3">
            <span className="text-[#9C9C9C] text-xs font-medium whitespace-nowrap">
              {currentEpisode.currentTime}
            </span>

            {/* Custom Seek Slider */}
            <div className="flex-1 relative group">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeekChange}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                className="w-full h-1 bg-[#1A1A1A] rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-[#FF7A1A]
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:shadow-[#FF7A1A]/50
                  [&::-webkit-slider-thumb]:opacity-0
                  [&::-webkit-slider-thumb]:group-hover:opacity-100
                  [&::-webkit-slider-thumb]:transition-opacity
                  [&::-moz-range-thumb]:appearance-none
                  [&::-moz-range-thumb]:w-3
                  [&::-moz-range-thumb]:h-3
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-[#FF7A1A]
                  [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:shadow-lg
                  [&::-moz-range-thumb]:shadow-[#FF7A1A]/50"
                style={{
                  background: `linear-gradient(to right, #FF7A1A 0%, #FF9A3D ${progress}%, #1A1A1A ${progress}%, #1A1A1A 100%)`
                }}
              />
            </div>

            <span className="text-[#9C9C9C] text-xs font-medium whitespace-nowrap">
              -{currentEpisode.duration}
            </span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-3">
          {/* Previous */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#2A2A2A] flex items-center justify-center transition-colors duration-300"
          >
            <SkipBack className="w-4 h-4 text-[#FAFAF8] fill-current" />
          </motion.button>

          {/* Play/Pause */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF7A1A] to-[#FF9A3D] flex items-center justify-center shadow-lg shadow-[#FF7A1A]/30"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-[#050505] fill-current" />
            ) : (
              <Play className="w-5 h-5 text-[#050505] fill-current ml-0.5" />
            )}
          </motion.button>

          {/* Next */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#2A2A2A] flex items-center justify-center transition-colors duration-300"
          >
            <SkipForward className="w-4 h-4 text-[#FAFAF8] fill-current" />
          </motion.button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 w-32">
          <Volume2 className="w-5 h-5 text-[#9C9C9C]" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-1 bg-[#1A1A1A] rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-2.5
              [&::-webkit-slider-thumb]:h-2.5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#FF7A1A]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-thumb]:w-2.5
              [&::-moz-range-thumb]:h-2.5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-[#FF7A1A]
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:border-0"
            style={{
              background: `linear-gradient(to right, #FF7A1A 0%, #FF9A3D ${volume}%, #1A1A1A ${volume}%, #1A1A1A 100%)`
            }}
          />
        </div>

        {/* Close */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full hover:bg-[#1A1A1A] flex items-center justify-center transition-colors duration-300"
        >
          <X className="w-5 h-5 text-[#9C9C9C]" />
        </motion.button>
      </div>
    </div>
  );
}
