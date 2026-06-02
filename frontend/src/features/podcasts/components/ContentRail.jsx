// ─────────────────────────────────────────────────────────
// ContentRail — Horizontal discovery rail
// Scrollable track with fade masks and navigation arrows.
// ─────────────────────────────────────────────────────────

import { useRef, useState, useCallback, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';

export default function ContentRail({ title, children, id }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const isVisible = useInView(sectionRef, { once: true, margin: '-60px' });

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ── Scroll state bookkeeping ────────────────────────────
  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 0);
    setCanScrollRight(
      track.scrollLeft < track.scrollWidth - track.clientWidth - 10,
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    // Re-evaluate on resize (content may reflow)
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(track);
    updateScrollState();

    return () => ro.disconnect();
  }, [updateScrollState]);

  // ── Arrow handlers ──────────────────────────────────────
  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * 300, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`content-rail hub-section hub-reveal${isVisible ? ' hub-reveal--visible' : ''}`}
    >
      {/* Header */}
      <div className="content-rail__header">
        <h2 className="content-rail__title">{title}</h2>

        <div className="content-rail__nav">
          <button
            className="content-rail__arrow"
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M9 3L5 7L9 11"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="content-rail__arrow"
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M5 3L9 7L5 11"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Track */}
      <div className="content-rail__track-wrapper">
        <div
          className={`content-rail__fade-left${canScrollLeft ? ' content-rail__fade-left--visible' : ''}`}
        />
        <div
          ref={trackRef}
          className="content-rail__track"
          onScroll={updateScrollState}
        >
          {children}
        </div>
        <div
          className={`content-rail__fade-right${canScrollRight ? ' content-rail__fade-right--visible' : ''}`}
        />
      </div>
    </section>
  );
}
