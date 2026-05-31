import { motion } from 'motion/react';
import { SlidersHorizontal, Star, Clock, TrendingUp, Sparkles } from 'lucide-react';

const quickFilters = [
  { id: 'trending', label: 'Trending', icon: TrendingUp, color: 'from-[#FF7A1A] to-[#FF9A3D]' },
  { id: 'new', label: 'New Releases', icon: Sparkles, color: 'from-[#FF9A3D] to-[#C9A46A]' },
  { id: 'top-rated', label: 'Top Rated', icon: Star, color: 'from-[#C9A46A] to-[#FF7A1A]' },
  { id: 'under-hour', label: 'Under 1 Hour', icon: Clock, color: 'from-[#FF7A1A] to-[#FF9A3D]' }
];

export default function QuickFilters() {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 flex-1">
          {quickFilters.map((filter, index) => {
            const Icon = filter.icon;
            return (
              <motion.button
                key={filter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-5 py-3 rounded-xl bg-gradient-to-br from-[#0D0D0D]/80 to-[#050505]/90 backdrop-blur-xl border border-[#FF7A1A]/20 hover:border-[#FF7A1A]/60 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#FF7A1A]/20"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${filter.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                <div className="relative flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#FF7A1A] group-hover:text-[#FF9A3D] transition-colors duration-300" />
                  <span className="text-[#FAFAF8] text-sm font-semibold">{filter.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-3 rounded-xl bg-gradient-to-br from-[#0D0D0D]/80 to-[#050505]/90 backdrop-blur-xl border border-[#FF7A1A]/20 hover:border-[#FF7A1A]/60 transition-all duration-500 flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#FF7A1A]/20"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#FF7A1A]" />
          <span className="text-[#FAFAF8] text-sm font-semibold">More</span>
        </motion.button>
      </div>
    </div>
  );
}
