// ─────────────────────────────────────────────────────────
// PodcastHubLayout — Page shell for the Podcast Hub
// Provides the fixed header, ambient background, and
// content wrapper for all hub sections.
// ─────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import './PodcastHubLayout.css';

export function PodcastHubLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="podcast-hub">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Hub Header */}
        <header className={`hub-header${isScrolled ? ' hub-header--scrolled' : ''}`}>
          <div className="hub-header__inner">
            <div className="hub-header__brand">
              <Link to="/" className="hub-header__logo">ZPF</Link>
              <div className="hub-header__divider" />
              <span className="hub-header__title">Podcast Hub</span>
            </div>
            <nav className="hub-header__nav">
              <Link to="/" className="hub-header__back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                Home
              </Link>
            </nav>
          </div>
        </header>

        {/* Content */}
        <div className="podcast-hub__content">
          {typeof children === 'function' ? children({ initialCategory }) : children}
        </div>
      </motion.div>
    </div>
  );
}

export default PodcastHubLayout;
