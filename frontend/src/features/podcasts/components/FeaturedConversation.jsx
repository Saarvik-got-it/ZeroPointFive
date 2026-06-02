// ─────────────────────────────────────────────────────────
// FeaturedConversation — Cinematic hero card
// Large featured episode card with parallax image tracking,
// ambient glow, and editorial content overlay.
// ─────────────────────────────────────────────────────────

import { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { featuredEpisode } from '@/features/podcasts/data/podcastsData';

export default function FeaturedConversation({ onPlay }) {
  const cardRef = useRef(null);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;  // ±8px
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setImageOffset({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setImageOffset({ x: 0, y: 0 });
  }, []);

  const { episodeNumber, title, guest, runtime, views, topics, category } =
    featuredEpisode;

  return (
    <motion.div
      className="featured-conv"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="featured-conv__card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        role="article"
        aria-label={`Featured episode: ${title}`}
      >
        {/* ── Background image with parallax ── */}
        <div className="featured-conv__image-wrapper">
          <img
            className="featured-conv__image"
            src={guest.image}
            alt={guest.name}
            loading="eager"
            style={{
              transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(${isHovered ? 1.03 : 1})`,
            }}
          />
        </div>

        {/* ── Gradient & glow overlays ── */}
        <div className="featured-conv__gradient" />
        <div className="featured-conv__glow" />

        {/* ── Content ── */}
        <div className="featured-conv__content">
          <span className="featured-conv__episode-badge">
            EP. {episodeNumber}
          </span>

          <h2 className="featured-conv__title">{title}</h2>

          <div className="featured-conv__guest">{guest.name}</div>
          <div className="featured-conv__company">
            {guest.role} · {guest.company}
          </div>

          {/* Meta row */}
          <div className="featured-conv__meta">
            <span>{runtime}</span>
            <span className="featured-conv__meta-separator" />
            <span>{views} views</span>
            <span className="featured-conv__meta-separator" />
            <span>{category}</span>
          </div>

          {/* Topics */}
          <div className="featured-conv__topics">
            {topics.map((topic) => (
              <span key={topic} className="featured-conv__topic">
                {topic}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="featured-conv__actions">
            <button
              className="featured-conv__btn featured-conv__btn--primary"
              onClick={() => onPlay && onPlay({ title, guest: guest.name, duration: runtime, image: guest.image })}
              aria-label="Listen to episode"
            >
              <svg
                width="10"
                height="12"
                viewBox="0 0 10 12"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M0 0 L10 6 L0 12 Z" />
              </svg>
              Listen
            </button>

            <button
              className="featured-conv__btn featured-conv__btn--secondary"
              aria-label="Watch episode"
            >
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                aria-hidden="true"
              >
                <ellipse cx="7" cy="5" rx="6" ry="4.5" />
                <circle cx="7" cy="5" r="1.8" />
              </svg>
              Watch
            </button>

            <button
              className="featured-conv__btn featured-conv__btn--ghost"
              aria-label="Preview episode"
            >
              Preview
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
