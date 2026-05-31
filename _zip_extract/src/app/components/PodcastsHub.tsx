import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Sidebar from './hub/Sidebar';
import TopBar from './hub/TopBar';
import TrendingSection from './hub/TrendingSection';
import QuickFilters from './hub/QuickFilters';
import ContinueWatching from './hub/ContinueWatching';
import MostViewed from './hub/MostViewed';
import FounderFavorites from './hub/FounderFavorites';
import LatestReleases from './hub/LatestReleases';
import NowPlaying from './hub/NowPlaying';

export default function PodcastsHub() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      setScrollY(target.scrollTop);
    };

    const scrollContainer = document.getElementById('hub-content');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#050505] flex overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF7A1A]/5 rounded-full blur-[150px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF9A3D]/5 rounded-full blur-[150px]"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 pb-32 relative">
        {/* Top Bar with Parallax */}
        <motion.div
          style={{
            opacity: scrollY > 50 ? 0.95 : 1,
          }}
        >
          <TopBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </motion.div>

        {/* Scrollable Content */}
        <div
          id="hub-content"
          className="flex-1 overflow-y-auto px-8 py-6 space-y-16 scroll-smooth"
        >
          {/* Trending Section */}
          <TrendingSection />

          {/* Quick Filters */}
          <QuickFilters />

          {/* Continue Watching */}
          <ContinueWatching />

          {/* Most Viewed */}
          <MostViewed />

          {/* Founder Favorites */}
          <FounderFavorites />

          {/* Latest Releases */}
          <LatestReleases />

          {/* Spacer for better scrolling */}
          <div className="h-24" />
        </div>
      </div>

      {/* Now Playing Bar (Bottom) */}
      <NowPlaying />
    </div>
  );
}
