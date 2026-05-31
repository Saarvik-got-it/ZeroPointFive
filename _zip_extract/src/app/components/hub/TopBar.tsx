import { motion } from 'motion/react';
import { Search, Mic, User } from 'lucide-react';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const categories = ['All', 'Business', 'Startups', 'Technology', 'Leadership', 'Innovation', 'AI'];

export default function TopBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-[#FF7A1A]/10">
      {/* Search Bar */}
      <div className="flex items-center gap-4 px-8 py-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9C9C9C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search episodes, guests, topics..."
            className="w-full bg-[#0D0D0D]/60 border border-[#FF7A1A]/20 rounded-xl pl-12 pr-12 py-3 text-[#FAFAF8] placeholder-[#9C9C9C] focus:outline-none focus:border-[#FF7A1A]/50 transition-colors duration-300"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2">
            <Mic className="w-5 h-5 text-[#9C9C9C] hover:text-[#FF7A1A] transition-colors duration-300" />
          </button>
        </div>

        {/* Search Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3D] rounded-xl text-[#050505] font-semibold hover:shadow-lg hover:shadow-[#FF7A1A]/30 transition-shadow duration-300"
        >
          Search
        </motion.button>

        {/* User Profile */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF7A1A] to-[#FF9A3D] flex items-center justify-center"
        >
          <User className="w-5 h-5 text-[#050505]" />
        </motion.button>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 px-8 pb-4 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-[#FF7A1A] to-[#FF9A3D] text-[#050505]'
                : 'bg-[#0D0D0D]/60 text-[#9C9C9C] hover:text-[#FAFAF8] border border-[#FF7A1A]/10'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
