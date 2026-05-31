import { motion } from 'motion/react';
import { ChevronRight, Eye, Play, Star } from 'lucide-react';

const episodes = [
  { id: 1, title: 'From Zero to Unicorn', guests: [{ name: 'Emma Thompson', image: 301 }, { name: 'Sarah Chen', image: 302 }], subtitle: 'From Zero to unicorn', views: '95K', duration: '58 min', category: 'Startups', rating: 4.9 },
  { id: 2, title: 'AI Revolution', guests: [{ name: 'James Liu', image: 303 }, { name: 'David Kim', image: 304 }], subtitle: 'The future of artificial intelligence', views: '120K', duration: '1h 5min', category: 'Technology', rating: 4.8 },
  { id: 3, title: 'Product Strategy', guests: [{ name: 'Nina Patel', image: 305 }, { name: 'Alex Morgan', image: 306 }], subtitle: 'Building products that matter', views: '87K', duration: '42 min', category: 'Product', rating: 5.0 },
  { id: 4, title: 'Leadership Lessons', guests: [{ name: 'Carlos Rivera', image: 307 }, { name: 'Lisa Wang', image: 308 }], subtitle: 'Leading through change', views: '76K', duration: '52 min', category: 'Leadership', rating: 4.7 }
];

export default function MostViewed() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="w-1 h-8 bg-gradient-to-b from-[#FF7A1A] to-[#FF9A3D] rounded-full" />
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FAFAF8] to-[#9C9C9C] bg-clip-text text-transparent">Most Viewed</h2>
            <p className="text-[#9C9C9C] text-sm">Top episodes this month</p>
          </div>
        </div>
        <motion.button whileHover={{ x: 5, scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF7A1A]/10 to-[#FF9A3D]/10 border border-[#FF7A1A]/30 rounded-xl text-[#FF7A1A] hover:border-[#FF7A1A]/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#FF7A1A]/20">
          <span className="text-sm font-semibold">View all</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {episodes.map((episode, index) => (
          <motion.div key={episode.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} whileHover={{ y: -8 }} className="relative group cursor-pointer">
            <div className="bg-gradient-to-br from-[#0D0D0D] via-[#0A0A0A] to-[#050505] backdrop-blur-xl border border-[#FF7A1A]/20 rounded-2xl overflow-hidden hover:border-[#FF7A1A]/70 transition-all duration-700 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,122,26,0.4)]">
              <div className="relative h-48 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center overflow-hidden">
                <div className="relative flex items-center justify-center">
                  <motion.div className="relative w-28 h-28 rounded-full border-4 border-[#0D0D0D] overflow-hidden shadow-2xl shadow-black/50" whileHover={{ scale: 1.15, x: -8, zIndex: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <img src={`https://i.pravatar.cc/300?img=${episode.guests[0].image % 70}`} alt={episode.guests[0].name} className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div className="relative w-28 h-28 rounded-full border-4 border-[#FF7A1A]/20 overflow-hidden shadow-2xl shadow-[#FF7A1A]/30 -ml-10" whileHover={{ scale: 1.15, x: 8, zIndex: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <img src={`https://i.pravatar.cc/300?img=${episode.guests[1].image % 70}`} alt={episode.guests[1].name} className="w-full h-full object-cover" />
                  </motion.div>
                </div>
                <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF7A1A] to-[#FF9A3D] flex items-center justify-center shadow-2xl shadow-[#FF7A1A]/60">
                    <Play className="w-7 h-7 text-[#050505] fill-current ml-1" />
                  </motion.div>
                </motion.div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-full border border-[#FFD700]/30">
                  <Star className="w-3.5 h-3.5 text-[#FFD700] fill-current" />
                  <span className="text-white text-xs font-bold">{episode.rating}</span>
                </div>
              </div>
              <div className="p-5">
                <motion.div whileHover={{ scale: 1.05 }} className="inline-block px-3 py-1.5 bg-gradient-to-r from-[#FF7A1A]/15 to-[#FF9A3D]/15 border border-[#FF7A1A]/40 rounded-full mb-3">
                  <span className="text-[#FF7A1A] text-xs font-bold">{episode.category}</span>
                </motion.div>
                <h3 className="text-[#FAFAF8] font-bold text-lg mb-1 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#FF7A1A] group-hover:to-[#FF9A3D] group-hover:bg-clip-text transition-all duration-300">{episode.title}</h3>
                <p className="text-[#9C9C9C] text-sm mb-4">{episode.subtitle}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1A1A]/60 rounded-full text-[#9C9C9C]">
                    <Eye className="w-3.5 h-3.5 text-[#FF7A1A]" />
                    <span className="font-semibold">{episode.views} views</span>
                  </div>
                  <span className="text-[#9C9C9C] font-medium">{episode.duration}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
