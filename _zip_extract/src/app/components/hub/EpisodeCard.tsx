import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Play, Bookmark, Share2, MoreVertical, Clock, Eye, Star, TrendingUp, Headphones } from 'lucide-react';

interface Episode {
  id: number;
  title: string;
  guest: string;
  duration: string;
  category: string;
  thumbnail: string;
  views?: string;
  rating?: number;
  isTrending?: boolean;
  isNew?: boolean;
  isFavorite?: boolean;
  progress?: number;
}

interface EpisodeCardProps {
  episode: Episode;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
}

export default function EpisodeCard({ episode, size = 'medium', showProgress = false }: EpisodeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(episode.isFavorite || false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const sizeClasses = {
    small: 'h-40',
    medium: 'h-52',
    large: 'h-72'
  };

  // Get images from Pravatar
  const imageUrl = `https://i.pravatar.cc/400?img=${episode.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      onMouseMove={handleMouseMove}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      className="relative group cursor-pointer perspective-1000"
    >
      <div className="bg-[#0D0D0D]/80 backdrop-blur-xl border border-[#FF7A1A]/20 rounded-2xl overflow-hidden hover:border-[#FF7A1A]/60 transition-all duration-500 shadow-2xl hover:shadow-[#FF7A1A]/20">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {episode.isTrending && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="px-2.5 py-1 bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3D] rounded-full flex items-center gap-1 shadow-lg shadow-[#FF7A1A]/50"
            >
              <TrendingUp className="w-3 h-3 text-[#050505]" />
              <span className="text-[#050505] text-xs font-bold">Trending</span>
            </motion.div>
          )}
          {episode.isNew && (
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="px-2.5 py-1 bg-[#FF7A1A] rounded-full shadow-lg shadow-[#FF7A1A]/50"
            >
              <span className="text-[#050505] text-xs font-bold">NEW</span>
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-3 right-3 z-20 flex gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                }}
                className={`w-9 h-9 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isBookmarked
                    ? 'bg-gradient-to-br from-[#FF7A1A] to-[#FF9A3D] text-[#050505] shadow-[#FF7A1A]/50'
                    : 'bg-black/50 text-white hover:bg-black/70 border border-white/20'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-xl flex items-center justify-center hover:bg-black/70 transition-all duration-300 border border-white/20 shadow-lg"
              >
                <Share2 className="w-4 h-4 text-white" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Thumbnail with Professional Treatment */}
        <div className={`relative ${sizeClasses[size]} bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] overflow-hidden`}>
          {/* Image Container with Multiple Layers */}
          <div className="absolute inset-0">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A1A]/10 to-[#FF9A3D]/5" />

            {/* Main Image */}
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: isHovered ? 1.15 : 1,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <img
                src={imageUrl}
                alt={episode.guest}
                onLoad={() => setImageLoaded(true)}
                className="w-full h-full object-cover"
                style={{
                  filter: isHovered ? 'brightness(0.7) saturate(1.2)' : 'brightness(0.9)',
                  transition: 'filter 0.3s ease'
                }}
              />
            </motion.div>

            {/* Gradient Overlays for Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A1A]/20 via-transparent to-[#FF9A3D]/10 opacity-40" />

            {/* Edge Glow */}
            <div className="absolute inset-0 border-4 border-[#FF7A1A]/0 group-hover:border-[#FF7A1A]/30 transition-all duration-500 rounded-2xl" />

            {/* Shimmer Effect */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: '200%', opacity: [0, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Play Overlay with Enhanced Effects */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4"
              >
                {/* Ripple Effect */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 2, opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-32 h-32 rounded-full border-2 border-[#FF7A1A]" />
                </motion.div>

                {/* Play Button */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.85 }}
                  className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#FF7A1A] to-[#FF9A3D] flex items-center justify-center shadow-2xl shadow-[#FF7A1A]/60 cursor-pointer z-10"
                >
                  {/* Pulsing ring */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-[#FF7A1A]"
                  />
                  <Play className="w-9 h-9 text-[#050505] fill-current ml-1.5 relative z-10" />
                </motion.div>

                {/* Listen Count */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20"
                >
                  <Headphones className="w-4 h-4 text-[#FF7A1A]" />
                  <span className="text-white text-xs font-semibold">
                    {episode.views || `${Math.floor(Math.random() * 50 + 10)}K plays`}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Duration Badge - Enhanced */}
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg flex items-center gap-1.5 border border-white/10 shadow-lg"
          >
            <Clock className="w-3.5 h-3.5 text-[#FF7A1A]" />
            <span className="text-white text-xs font-semibold">{episode.duration}</span>
          </motion.div>

          {/* Guest Name Overlay */}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-gradient-to-r from-[#FF7A1A]/90 to-[#FF9A3D]/90 backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
            <span className="text-[#050505] text-xs font-bold">{episode.guest}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 bg-gradient-to-b from-[#0D0D0D] to-[#050505]">
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block px-3 py-1 bg-gradient-to-r from-[#FF7A1A]/20 to-[#FF9A3D]/20 border border-[#FF7A1A]/40 rounded-full text-[#FF7A1A] text-xs font-semibold shadow-sm"
            >
              {episode.category}
            </motion.div>
            {episode.rating && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-1 px-2 py-1 bg-[#1A1A1A] rounded-full"
              >
                <Star className="w-3.5 h-3.5 text-[#FFD700] fill-current" />
                <span className="text-[#FAFAF8] text-xs font-bold">{episode.rating}</span>
              </motion.div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[#FAFAF8] font-bold text-base mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#FF7A1A] group-hover:to-[#FF9A3D] group-hover:bg-clip-text transition-all duration-300 leading-snug">
            {episode.title}
          </h3>

          {/* Progress Bar */}
          {showProgress && episode.progress !== undefined && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="w-full h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden origin-left mb-2"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF7A1A] via-[#FF9A3D] to-[#C9A46A] rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${episode.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                {/* Shimmer on progress bar */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Waveform Preview on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-end gap-0.5 h-10"
              >
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[#FF7A1A] via-[#FF9A3D] to-[#C9A46A] rounded-full"
                    initial={{ height: 0 }}
                    animate={{
                      height: [`${15 + Math.random() * 70}%`, `${15 + Math.random() * 70}%`],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                      height: {
                        duration: 0.6 + Math.random() * 0.6,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: i * 0.02
                      },
                      opacity: {
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Enhanced Glow Effect */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FF7A1A]/30 to-[#FF9A3D]/30 rounded-2xl blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 -z-20 bg-gradient-to-br from-[#FF7A1A]/20 to-[#FF9A3D]/20 rounded-2xl blur-3xl"
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
