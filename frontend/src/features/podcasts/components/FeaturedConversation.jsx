// ─────────────────────────────────────────────────────────
// FeaturedConversation — Cinematic hero card
// Large featured episode card with parallax image tracking,
// ambient glow, and editorial content overlay.
// ─────────────────────────────────────────────────────────

import { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { featuredEpisode } from '@/features/podcasts/data/podcastsData';
import HeroWaveTrails from './HeroWaveTrails';

export default function FeaturedConversation({ episode, onPlay }) {
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

  const activeEpisode = episode || featuredEpisode;
  const { episodeNumber, title, guest, runtime, views, topics, category } =
    activeEpisode;

  // Resolve properties that might be structured differently between dynamic JSON and mock objects
  const guestName = typeof guest === "string" ? guest : (guest?.name || "");
  const guestCompany = typeof guest === "string" ? (activeEpisode.company || "") : (guest?.company || "");
  const guestRole = typeof guest === "string" ? (activeEpisode.role || "") : (guest?.role || "");
  const guestImage = typeof guest === "string" ? (activeEpisode.image || "") : (guest?.image || "");
  const displayRuntime = runtime || activeEpisode.duration || "45 min";

  const isYoutubeImage = typeof guestImage === 'string' && (guestImage.includes('ytimg.com') || guestImage.includes('youtube.com'));

  return (
    <motion.div
      className="featured-conv"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── V2: EKG wave trails on the right side ── */}
      <HeroWaveTrails />

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
            src={guestImage}
            alt={guestName}
            loading="eager"
            style={{
              animationName: isHovered ? 'none' : undefined,
              transform: isHovered
                ? `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(1.03)`
                : undefined,
              objectPosition: isYoutubeImage ? '80% center' : undefined,
            }}
          />
        </div>

        {/* ── V2: Cinematic dust particles ── */}
        <div className="featured-conv__particles" aria-hidden="true">
          {Array.from({ length: 20 }, (_, i) => (
            <span
              key={i}
              className="featured-conv__particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${0.5 + Math.random() * 1.5}px`,
                height: `${0.5 + Math.random() * 1.5}px`,
                '--dx': `${(Math.random() - 0.5) * 80}px`,
                '--dy': `${-20 - Math.random() * 60}px`,
                animationDuration: `${8 + Math.random() * 12}s`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        {/* ── Gradient, glow & ambient overlays ── */}
        <div className="featured-conv__gradient" />
        <div className="featured-conv__glow" />
        <div className="featured-conv__ambient-glow" />

        {/* ── Content ── */}
        <div className="featured-conv__content">
          <span className="featured-conv__episode-badge">
            EP. {episodeNumber}
          </span>

          <h2 className="featured-conv__title">{title}</h2>

          <div className="featured-conv__guest">{guestName}</div>
          <div className="featured-conv__company">
            {guestRole} · {guestCompany}
          </div>

          {/* Meta row */}
          <div className="featured-conv__meta">
            <span>{displayRuntime}</span>
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
              onClick={() => onPlay && onPlay({ title, guest: guestName, duration: displayRuntime, image: guestImage })}
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
