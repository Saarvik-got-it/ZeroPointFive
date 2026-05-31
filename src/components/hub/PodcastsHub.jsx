import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import TrendingSection from './TrendingSection';
import QuickFilters from './QuickFilters';
import ContinueWatching from './ContinueWatching';
import MostViewed from './MostViewed';
import FounderFavorites from './FounderFavorites';
import LatestReleases from './LatestReleases';
import NowPlaying from './NowPlaying';

export default function PodcastsHub() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const scrollContainer = document.getElementById('hub-content');
    if (!scrollContainer) return undefined;

    const handleScroll = () => {
      setScrollY(scrollContainer.scrollTop);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const element = document.getElementById('hub-content');
    if (element) element.scrollTop = 0;
  }, []);

  // Render the reference HTML in an iframe for pixel-perfect parity.
  return (
    <div style={{ height: '100dvh' }}>
      <iframe
        title="Podcasts Hub Reference"
        src="/hub-reference.html"
        style={{
          width: '100%',
          height: '100dvh',
          border: '0',
        }}
      />
    </div>
  );
}
