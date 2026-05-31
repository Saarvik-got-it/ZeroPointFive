import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

const trendingEpisodes = [
  {
    id: 1,
    title: 'DR. ELIZA REED | THE FUTURE OF QUANTUM COMPUTING',
    guest: 'Dr. Eliza Reed',
    views: '120K views',
    category: 'Technology',
    duration: '58 min',
    podcastName: 'Zero Point Five Show'
  },
  {
    id: 2,
    title: 'RITESH AGARWAL | BUILDING OYO FROM SCRATCH',
    guest: 'Ritesh Agarwal',
    views: '95K views',
    category: 'Startups',
    duration: '1h 2min',
    podcastName: 'Zero Point Five Show'
  },
  {
    id: 3,
    title: 'VARUN MAYYA | AI IS EATING THE WORLD',
    guest: 'Varun Mayya',
    views: '150K views',
    category: 'AI',
    duration: '1h 12min',
    podcastName: 'Zero Point Five Show'
  }
];

// Star particle component
function StarParticle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0]
      }}
      transition={{
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    />
  );
}

export default function TrendingSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentEpisode = trendingEpisodes[currentIndex];

  const nextEpisode = () => {
    setCurrentIndex((prev) => (prev + 1) % trendingEpisodes.length);
  };

  const prevEpisode = () => {
    setCurrentIndex((prev) => (prev - 1 + trendingEpisodes.length) % trendingEpisodes.length);
  };

  return (
    <section>
      <h2 className="text-xl font-bold text-[#FAFAF8] mb-4">Trending Section</h2>

      <div className="relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-[#0F1419] to-[#1A1F2E] rounded-2xl overflow-hidden h-72"
          >
            {/* Starry Background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <StarParticle key={i} delay={i * 0.2} />
              ))}
            </div>

            {/* Blue/Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/90 via-transparent to-[#0A0E1A]/70" />

            {/* Content Container */}
            <div className="relative h-full flex items-center">
              {/* Guest Photo - Left Side (Full Height) */}
              <div className="h-full w-80 flex-shrink-0 relative">
                <img
                  src={`https://i.pravatar.cc/400?img=${currentEpisode.id + 10}`}
                  alt={currentEpisode.guest}
                  className="w-full h-full object-cover"
                />
                {/* Gradient fade on right edge */}
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-r from-transparent to-[#0F1419]" />
              </div>

              {/* Episode Details - Right Side */}
              <div className="flex-1 px-12 py-8 flex flex-col justify-center">
                {/* Title */}
                <h3 className="text-3xl font-bold text-white leading-tight mb-4 tracking-wide">
                  {currentEpisode.title}
                </h3>

                {/* Meta Info Row */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[#9C9C9C] text-sm">{currentEpisode.duration}</span>
                  <div className="w-1 h-1 bg-[#9C9C9C] rounded-full" />
                  <span className="text-[#9C9C9C] text-sm">{currentEpisode.views}</span>
                  <div className="w-1 h-1 bg-[#9C9C9C] rounded-full" />
                  <div className="px-3 py-1 bg-[#FF7A1A]/20 border border-[#FF7A1A]/40 rounded-full">
                    <span className="text-[#FF7A1A] text-xs font-semibold">
                      {currentEpisode.category}
                    </span>
                  </div>
                  <div className="w-1 h-1 bg-[#9C9C9C] rounded-full" />
                  <span className="text-[#9C9C9C] text-sm">{currentEpisode.podcastName}</span>
                </div>

                {/* Play Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF7A1A] to-[#FF9A3D] flex items-center justify-center shadow-2xl shadow-[#FF7A1A]/40 group/play"
                >
                  <Play className="w-8 h-8 text-[#050505] fill-current ml-1 group-hover/play:scale-110 transition-transform duration-300" />
                </motion.button>
              </div>
            </div>

            {/* Navigation Arrows */}
            <motion.button
              onClick={prevEpisode}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>

            <motion.button
              onClick={nextEpisode}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>

            {/* Progress Dots */}
            <div className="absolute bottom-4 right-8 flex items-center gap-2">
              {trendingEpisodes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-[#FF7A1A]'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
