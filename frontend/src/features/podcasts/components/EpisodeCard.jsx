// ─────────────────────────────────────────────────────────
// EpisodeCard — Premium multi-variant episode card
// Supports default, influential, trending, and surprise
// variants with scroll-triggered reveal animations.
// ─────────────────────────────────────────────────────────

import { useRef } from 'react';
import { useInView } from '@/hooks/useInView';

export default function EpisodeCard({
  episode,
  variant = 'default',
  index = 0,
  onPlay,
}) {
  const cardRef = useRef(null);
  const isVisible = useInView(cardRef, { once: true, margin: '-40px' });

  const {
    title,
    guest,
    duration,
    category,
    image,
    episodeNumber,
    badge,
    progress,
    rating,
    views,
    trendDelta,
    surprise,
  } = episode;

  const rootClass = [
    'episode-card',
    variant === 'influential' && 'episode-card--influential',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={cardRef}
      className={rootClass}
      onClick={() => onPlay && onPlay(episode)}
      role="article"
      aria-label={`Episode: ${title}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.5s ease, transform 0.5s ease`,
        transitionDelay: `${index * 0.08}s`,
      }}
    >
      {/* ── Image block ── */}
      <div className="episode-card__image-wrapper">
        <img
          className="episode-card__image"
          src={image}
          alt={guest}
          loading="lazy"
        />
        <div className="episode-card__overlay" />

        {badge && (
          <span className="episode-card__badge">{badge}</span>
        )}

        <span className="episode-card__ep-number">EP. {episodeNumber}</span>

        <div className="episode-card__play-indicator" aria-hidden="true">
          <svg
            width="10"
            height="12"
            viewBox="0 0 10 12"
            fill="currentColor"
          >
            <path d="M0 0 L10 6 L0 12 Z" />
          </svg>
        </div>

        {progress != null && (
          <div className="episode-card__progress">
            <div
              className="episode-card__progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* ── Text content ── */}
      <div className="episode-card__title">{title}</div>
      <div className="episode-card__guest">{guest}</div>

      <div className="episode-card__meta">
        <span>{duration}</span>
        <span>·</span>
        <span className="episode-card__category">{category}</span>
      </div>

      {/* ── Variant-specific elements ── */}
      {variant === 'influential' && rating != null && (
        <div className="episode-card__rating">★ {rating}</div>
      )}
      {variant === 'influential' && views && (
        <div className="episode-card__views">{views} views</div>
      )}
      {variant === 'trending' && trendDelta && (
        <div className="episode-card__trend">{trendDelta}</div>
      )}
      {variant === 'surprise' && surprise && (
        <div className="episode-card__surprise">{surprise}</div>
      )}
    </div>
  );
}
