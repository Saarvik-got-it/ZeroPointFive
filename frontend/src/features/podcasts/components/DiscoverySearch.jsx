import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { searchPlaceholders } from '@/features/podcasts/data/podcastsData';

const CYCLE_MS = 4000;

export function DiscoverySearch() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % searchPlaceholders.length),
      CYCLE_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="discovery-search"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="discovery-search__container">
        <div className="discovery-search__input-wrapper">
          {/* Search icon */}
          <span className="discovery-search__icon" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>

          {/* Input with animated placeholder */}
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="discovery-search__input"
              aria-label="Search conversations"
              placeholder=" "
            />
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 0.4, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.85rem',
                  letterSpacing: '0.02em',
                  color: 'rgb(97, 97, 97)',
                  whiteSpace: 'nowrap',
                }}
                aria-hidden="true"
              >
                {searchPlaceholders[index]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Voice / mic icon */}
          <button
            className="discovery-search__voice"
            aria-label="Voice search"
            type="button"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="1" width="6" height="12" rx="3" />
              <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default DiscoverySearch;
