import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';

const hubTrendingEpisodes = [
  {
    id: 1,
    title: 'Ritesh Agarwal | Building OYO from Scratch',
    guest: { name: 'Ritesh Agarwal', image: 'https://i.pravatar.cc/600?img=11' },
    views: '95K views',
    category: 'Startups',
    duration: '58 min',
    podcastName: 'Zero Point Five Show',
  },
  {
    id: 2,
    title: 'Sridhar Vembu | AI is Eating the World',
    guest: { name: 'Sridhar Vembu', image: 'https://i.pravatar.cc/600?img=12' },
    views: '120K views',
    category: 'Technology',
    duration: '1h 5min',
    podcastName: 'Zero Point Five Show',
  },
  {
    id: 3,
    title: 'Kunal Shah | Product Strategy in Chaos',
    guest: { name: 'Kunal Shah', image: 'https://i.pravatar.cc/600?img=13' },
    views: '87K views',
    category: 'Product',
    duration: '42 min',
    podcastName: 'Zero Point Five Show',
  },
];

export default function TrendingSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentEpisode = hubTrendingEpisodes[currentIndex];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-[#FF7A1A] mb-2">Trending</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#FAFAF8]">What people are listening to now.</h2>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => setCurrentIndex((value) => (value - 1 + hubTrendingEpisodes.length) % hubTrendingEpisodes.length)} className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:border-[#FF7A1A]/50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentIndex((value) => (value + 1) % hubTrendingEpisodes.length)} className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:border-[#FF7A1A]/50 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentEpisode.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl border border-[#FF7A1A]/20 bg-gradient-to-br from-[#0F1419] to-[#1A1F2E] min-h-[360px]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/90 via-transparent to-[#0A0E1A]/70" />
          <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,122,26,0.18), transparent 25%), radial-gradient(circle at 80% 80%, rgba(255,154,61,0.15), transparent 20%)' }} />
          <div className="relative grid lg:grid-cols-[320px,1fr] items-stretch min-h-[360px]">
            <div className="relative h-72 lg:h-auto overflow-hidden">
              <img src={currentEpisode.guest.image} alt={currentEpisode.guest.name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-r from-transparent to-[#0F1419]" />
            </div>
            <div className="relative p-8 md:p-12 flex flex-col justify-center gap-5">
              <p className="font-mono text-[11px] tracking-widest uppercase text-[#9C9C9C]">{currentEpisode.podcastName}</p>
              <h3 className="text-3xl md:text-5xl font-bold leading-tight text-white max-w-3xl">{currentEpisode.title}</h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#9C9C9C]">
                <span>{currentEpisode.duration}</span>
                <span className="w-1 h-1 rounded-full bg-[#9C9C9C]" />
                <span>{currentEpisode.views}</span>
                <span className="w-1 h-1 rounded-full bg-[#9C9C9C]" />
                <span className="px-3 py-1 rounded-full bg-[#FF7A1A]/20 border border-[#FF7A1A]/30 text-[#FF7A1A]">{currentEpisode.category}</span>
              </div>
              <div className="flex items-center gap-4">
                <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF7A1A] to-[#FF9A3D] flex items-center justify-center shadow-2xl shadow-[#FF7A1A]/40">
                  <Play className="w-8 h-8 text-[#050505] fill-current ml-1" />
                </motion.button>
                <button className="cin-btn text-[10px]">
                  View episode
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
