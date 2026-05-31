import { motion } from 'motion/react';
import { ChevronRight, Play } from 'lucide-react';

const episodes = [
  {
    id: 1,
    title: 'Mastering AI Ethics',
    guest: 'Alex Chen',
    duration: '32 min',
    viewed: '18 min',
    progress: 56,
    category: 'AI'
  },
  {
    id: 2,
    title: 'Product Leadership',
    guest: 'Sarah Williams',
    duration: '45 min',
    viewed: '20 min',
    progress: 44,
    category: 'Product'
  },
  {
    id: 3,
    title: 'Startup Fundraising',
    guest: 'David Park',
    duration: '55 min',
    viewed: '30 min',
    progress: 54,
    category: 'Startups'
  },
  {
    id: 4,
    title: 'Engineering Culture',
    guest: 'Maria Garcia',
    duration: '48 min',
    viewed: '15 min',
    progress: 31,
    category: 'Engineering'
  }
];

export default function ContinueWatching() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-1 h-8 bg-gradient-to-b from-[#FF7A1A] to-[#FF9A3D] rounded-full"
          />
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FAFAF8] to-[#9C9C9C] bg-clip-text text-transparent">
              Continue Watching
            </h2>
            <p className="text-[#9C9C9C] text-sm">Pick up where you left off</p>
          </div>
        </div>
        <motion.button
          whileHover={{ x: 5, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF7A1A]/10 to-[#FF9A3D]/10 border border-[#FF7A1A]/30 rounded-xl text-[#FF7A1A] hover:border-[#FF7A1A]/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#FF7A1A]/20"
        >
          <span className="text-sm font-semibold">View all</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {episodes.map((episode, index) => (
          <motion.div
            key={episode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -8 }}
            className="relative group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-[#0D0D0D] via-[#0A0A0A] to-[#050505] backdrop-blur-xl border border-[#FF7A1A]/20 rounded-2xl overflow-hidden hover:border-[#FF7A1A]/70 transition-all duration-700 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,122,26,0.4)]">
              {/* Large Guest Photo */}
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <img
                    src={`https://i.pravatar.cc/400?img=${episode.id + 20}`}
                    alt={episode.guest}
                    className="w-full h-full object-cover"
                  />
                  {/* Shimmer Effect */}
                  <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{ x: '200%', opacity: [0, 0.3, 0] }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />
                </motion.div>

                {/* Multi-layer Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A1A]/10 via-transparent to-[#FF9A3D]/5" />

                {/* Play Button on Hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                >
                  {/* Ripple Effect */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.5, opacity: [0, 0.3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-24 h-24 rounded-full border-2 border-[#FF7A1A]" />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#FF7A1A] to-[#FF9A3D] flex items-center justify-center shadow-2xl shadow-[#FF7A1A]/70"
                  >
                    {/* Pulsing ring */}
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-[#FF7A1A]"
                    />
                    <Play className="w-7 h-7 text-[#050505] fill-current ml-1 relative z-10" />
                  </motion.div>
                </motion.div>

                {/* Enhanced Progress Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/70 backdrop-blur-sm">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#FF7A1A] via-[#FF9A3D] to-[#C9A46A] relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${episode.progress}%` }}
                    transition={{ duration: 1.2, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                  >
                    {/* Shimmer on progress */}
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Progress Text with Icon */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#FF7A1A]/20 to-[#FF9A3D]/20 border border-[#FF7A1A]/30 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A1A] animate-pulse" />
                    <span className="text-[#FF7A1A] text-xs font-bold">{episode.progress}% watched</span>
                  </div>
                  <span className="text-[#9C9C9C] text-xs">{episode.viewed} left</span>
                </div>

                {/* Title */}
                <h3 className="text-[#FAFAF8] font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#FF7A1A] group-hover:to-[#FF9A3D] group-hover:bg-clip-text transition-all duration-300">
                  {episode.title}
                </h3>

                {/* Guest and Category */}
                <div className="flex items-center justify-between">
                  <p className="text-[#FAFAF8] text-sm font-medium">{episode.guest}</p>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 bg-gradient-to-r from-[#FF7A1A]/15 to-[#FF9A3D]/15 border border-[#FF7A1A]/40 rounded-full text-[#FF7A1A] text-xs font-semibold"
                  >
                    {episode.category}
                  </motion.span>
                </div>
              </div>
            </div>

            {/* Enhanced Multi-Layer Glow Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FF7A1A]/30 to-[#FF9A3D]/30 rounded-2xl blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.6 }}
              transition={{ delay: 0.1 }}
              className="absolute inset-0 -z-20 bg-gradient-to-br from-[#FF7A1A]/20 to-[#FF9A3D]/20 rounded-2xl blur-3xl scale-110"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
