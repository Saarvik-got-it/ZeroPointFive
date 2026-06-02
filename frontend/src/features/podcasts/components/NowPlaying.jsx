// ─────────────────────────────────────────────────────────
// NowPlaying — Floating persistent player
// Simulated playback with waveform, progress bar,
// and enter/exit animations via AnimatePresence.
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { nowPlayingDefault } from '@/features/podcasts/data/podcastsData';

const WAVE_DELAYS = [0, 0.15, 0.3, 0.45, 0.6];

export default function NowPlaying({ track, onClose }) {
  const data = track || nowPlayingDefault;

  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(data.isPlaying ?? false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  // ── Auto-show after 3 s ─────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ── Simulated progress ──────────────────────────────────
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 0.5));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  // ── Handlers ────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setIsPlaying(false);
    onClose?.();
  }, [onClose]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return (
    <div className="now-playing">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="now-playing__bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          >
            {/* Collapsed row */}
            <div className="now-playing__collapsed">
              <img
                className="now-playing__thumb"
                src={data.image}
                alt={data.title}
              />

              <div className="now-playing__info">
                <div className="now-playing__track-title">{data.title}</div>
                <div className="now-playing__track-guest">{data.guest}</div>
              </div>

              {/* Waveform — visible only while playing */}
              {isPlaying && (
                <div className="now-playing__waveform">
                  {WAVE_DELAYS.map((delay, i) => (
                    <span
                      key={i}
                      className="now-playing__wave-bar"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              )}

              {/* Transport controls */}
              <div className="now-playing__controls">
                <button className="now-playing__btn" aria-label="Skip back">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M10 3L5 7L10 11"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="4"
                      y1="3"
                      x2="4"
                      y2="11"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <button
                  className="now-playing__btn now-playing__btn--play"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="3" y="2.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
                      <rect x="8.5" y="2.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M4 2.5L11.5 7L4 11.5V2.5Z" fill="currentColor" />
                    </svg>
                  )}
                </button>

                <button className="now-playing__btn" aria-label="Skip forward">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M4 3L9 7L4 11"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="10"
                      y1="3"
                      x2="10"
                      y2="11"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Close */}
              <button
                className="now-playing__close"
                onClick={handleClose}
                aria-label="Dismiss player"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 2L10 10M10 2L2 10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Mini progress bar */}
            <div className="now-playing__progress-mini">
              <div
                className="now-playing__progress-mini-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
