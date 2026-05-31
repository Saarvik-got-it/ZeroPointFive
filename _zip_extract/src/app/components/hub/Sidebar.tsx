import { useState } from 'react';
import { motion } from 'motion/react';
import { Home, TrendingUp, Grid, Bookmark, Clock, Download } from 'lucide-react';

const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'categories', label: 'Categories', icon: Grid },
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'downloads', label: 'Downloads', icon: Download }
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#0D0D0D] to-[#050505] backdrop-blur-xl border-r border-[#FF7A1A]/20 z-50 shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-[#FF7A1A]/20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="relative w-12 h-12 bg-gradient-to-br from-[#FF7A1A] to-[#FF9A3D] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF7A1A]/50"
          >
            <span className="text-[#050505] font-bold text-xl">0.5</span>
            {/* Pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-xl bg-[#FF7A1A]"
            />
          </motion.div>
          <div>
            <div className="text-[#FAFAF8] font-bold text-base">Zero Point Five</div>
            <div className="text-[#FF7A1A] text-xs font-semibold">Podcast Hub</div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all duration-300 overflow-hidden group ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF7A1A]/25 to-[#FF9A3D]/15 border border-[#FF7A1A]/40 shadow-lg shadow-[#FF7A1A]/10'
                  : 'hover:bg-[#1A1A1A]/60 border border-transparent'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF7A1A] to-[#FF9A3D] rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-r from-[#FF7A1A]/5 to-[#FF9A3D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <Icon
                className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                  isActive ? 'text-[#FF7A1A]' : 'text-[#9C9C9C] group-hover:text-[#FF7A1A]'
                }`}
              />
              <span
                className={`text-sm font-semibold relative z-10 transition-all duration-300 ${
                  isActive ? 'text-[#FAFAF8]' : 'text-[#9C9C9C] group-hover:text-[#FAFAF8]'
                }`}
              >
                {item.label}
              </span>

              {/* Badge for active */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-2 h-2 rounded-full bg-[#FF7A1A] shadow-lg shadow-[#FF7A1A]/50"
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
