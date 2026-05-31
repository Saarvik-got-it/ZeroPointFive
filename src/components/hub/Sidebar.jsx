import { motion } from 'motion/react';
import { Bookmark, Clock, Download, Grid3X3, Home, LayoutGrid, TrendingUp } from 'lucide-react';

const hubSidebarItems = [
  { id: 'home', label: 'Home' },
  { id: 'trending', label: 'Trending' },
  { id: 'categories', label: 'Categories' },
  { id: 'bookmarks', label: 'Bookmarks' },
  { id: 'history', label: 'History' },
  { id: 'downloads', label: 'Downloads' },
];

export default function Sidebar() {
  const menuIcons = {
    home: Home,
    trending: TrendingUp,
    categories: LayoutGrid,
    bookmarks: Bookmark,
    history: Clock,
    downloads: Download,
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#0D0D0D] to-[#050505] backdrop-blur-xl border-r border-[#FF7A1A]/20 z-50 shadow-2xl hidden lg:flex flex-col">
      <div className="p-6 border-b border-[#FF7A1A]/20">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 bg-gradient-to-br from-[#FF7A1A] to-[#FF9A3D] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF7A1A]/50">
            <span className="text-[#050505] font-bold text-xl">0.5</span>
          </div>
          <div>
            <div className="text-[#FAFAF8] font-bold text-base">Zero Point Five</div>
            <div className="text-[#FF7A1A] text-xs font-semibold">Podcast Hub</div>
          </div>
        </div>
      </div>

      <nav className="p-4 flex-1">
        {hubSidebarItems.map((item) => {
          const Icon = menuIcons[item.id] || Grid3X3;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'home') {
                  window.location.hash = '';
                }
              }}
              className="relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all duration-300 overflow-hidden group hover:bg-[#1A1A1A]/60 border border-transparent"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A1A]/5 to-[#FF9A3D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Icon className="w-5 h-5 relative z-10 text-[#9C9C9C] group-hover:text-[#FF7A1A] transition-colors duration-300" />
              <span className="text-sm font-semibold relative z-10 text-[#9C9C9C] group-hover:text-[#FAFAF8]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      
    </aside>
  );
}
