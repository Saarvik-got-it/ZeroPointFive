// ─────────────────────────────────────────────────────────
// EpisodeCard V2 — Premium multi-variant episode card
// Supports default, influential, trending, and surprise
// variants with scroll-triggered reveal animations.
// V2: Hover depth layer reveals hidden quote & topic.
// ─────────────────────────────────────────────────────────

import { useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import { useNavigate } from 'react-router-dom';
import { hoverReveals } from '@/features/podcasts/data/podcastsData';

export default function EpisodeCard({
  episode,
  variant = 'default',
  index = 0,
  onPlay,
}) {
  const cardRef = useRef(null);
  const isVisible = useInView(cardRef, { once: true, margin: '-40px' });
  const navigate = useNavigate();

  const {
    id,
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

  const isYoutubeImage = typeof image === 'string' && (image.includes('ytimg.com') || image.includes('youtube.com'));

  // V2: Hover depth data (use mock data, otherwise fall back to takeaways/topics dynamically)
  const dbReveal = (episode.takeaways && episode.takeaways.length > 0)
    ? {
        quote: episode.takeaways[0],
        topic: (episode.topics && episode.topics.length > 0) ? episode.topics[0] : (episode.category || 'General')
      }
    : null;
  const reveal = hoverReveals[id] || dbReveal;

  const rootClass = [
    'episode-card',
    variant === 'influential' && 'episode-card--influential',
  ]
    .filter(Boolean)
    .join(' ');

  const handleCardClick = (e) => {
    // Check if the click happened on the play button, progress bar, or play indicator
    const isPlayClick = e.target.closest('.episode-card__play-indicator') || e.target.closest('.episode-card__progress');
    if (isPlayClick) {
      e.stopPropagation();
      onPlay && onPlay(episode);
    } else if (episode.slug) {
      navigate(`/podcasts/${episode.slug}`);
    } else {
      // Mock cards play as usual
      onPlay && onPlay(episode);
    }
  };

  return (
    <div
      ref={cardRef}
      className={rootClass}
      onClick={handleCardClick}
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
          style={isYoutubeImage ? { objectPosition: '80% center' } : undefined}
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

        {/* V2: Depth reveal layer — appears on hover */}
        {reveal && (
          <div className="episode-card__depth-reveal">
            <div className="episode-card__depth-quote">{reveal.quote}</div>
            <div className="episode-card__depth-topic">{reveal.topic}</div>
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
