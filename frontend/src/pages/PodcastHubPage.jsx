// ─────────────────────────────────────────────────────────
// PodcastHubPage V2 — The Conversation Discovery Engine
// Hierarchy-first layout: hero → search → discovery.
// ─────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

// Layout & Ambient
import { PodcastHubLayout } from '@/features/podcasts/components/PodcastHubLayout';
import { AmbientCanvas } from '@/features/podcasts/components/AmbientCanvas';

// Sections
import { DiscoverySearch } from '@/features/podcasts/components/DiscoverySearch';
import { CategoryPills } from '@/features/podcasts/components/CategoryPills';
import FeaturedConversation from '@/features/podcasts/components/FeaturedConversation';
import ContentRail from '@/features/podcasts/components/ContentRail';
import EpisodeCard from '@/features/podcasts/components/EpisodeCard';
import ConversationTrails from '@/features/podcasts/components/ConversationTrails';
import NowPlaying from '@/features/podcasts/components/NowPlaying';
import IntelligencePulse from '@/features/podcasts/components/IntelligencePulse';

// Data
import {
  continueExploring,
  mostInfluential,
  founderPicks,
  trendingNow,
  futureTech,
  startupStories,
  leadershipInsights,
  unexpectedConversations,
} from '@/features/podcasts/data/podcastsData';

export default function PodcastHubPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [nowPlayingTrack, setNowPlayingTrack] = useState(null);

  const handlePlay = useCallback((episode) => {
    setNowPlayingTrack({
      title: episode.title,
      guest: episode.guest,
      duration: episode.duration || '50:00',
      image: episode.image,
      isPlaying: true,
    });
  }, []);

  // Filter helper
  const matchesCategory = useCallback((episode) => {
    if (activeCategory === 'all') return true;
    return episode.category?.toLowerCase() === activeCategory.toLowerCase();
  }, [activeCategory]);

  const filterRail = useCallback((items) => {
    if (activeCategory === 'all') return items;
    const filtered = items.filter(matchesCategory);
    return filtered.length >= 2 ? filtered : items;
  }, [activeCategory, matchesCategory]);

  const isPlaying = !!nowPlayingTrack?.isPlaying;

  return (
    <PodcastHubLayout>
      <AmbientCanvas />

      {/* ═══ V2 HERO ZONE ═══
          Featured conversation dominates the viewport.
          Search + categories are compressed below, not above. */}

      {/* Section 1: Featured Conversation — FIRST THING the eye sees */}
      <div className="hub-section hub-section--first" style={{ paddingBottom: '1rem' }}>
        <FeaturedConversation onPlay={handlePlay} />
      </div>

      {/* Section 2: Search + Categories — integrated, compressed */}
      <div className="hub-hero-zone">
        <div className="hub-section" style={{ paddingTop: '1rem', paddingBottom: '0.5rem' }}>
          <DiscoverySearch />
        </div>
        <div className="hub-section" style={{ paddingTop: '0.5rem', paddingBottom: '1rem' }}>
          <CategoryPills
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </div>

      <div className="hub-section__divider" />

      {/* Section 3: Content Rails */}
      <ContentRail title="Continue Exploring" id="continue-exploring">
        {filterRail(continueExploring).map((ep, i) => (
          <EpisodeCard key={ep.id} episode={ep} index={i} onPlay={handlePlay} />
        ))}
      </ContentRail>

      <ContentRail title="Most Influential" id="most-influential">
        {filterRail(mostInfluential).map((ep, i) => (
          <EpisodeCard key={ep.id} episode={ep} variant="influential" index={i} onPlay={handlePlay} />
        ))}
      </ContentRail>

      <div className="hub-section__divider" />

      <ContentRail title="Founder Picks" id="founder-picks">
        {filterRail(founderPicks).map((ep, i) => (
          <EpisodeCard key={ep.id} episode={ep} index={i} onPlay={handlePlay} />
        ))}
      </ContentRail>

      <ContentRail title="Trending Right Now" id="trending">
        {filterRail(trendingNow).map((ep, i) => (
          <EpisodeCard key={ep.id} episode={ep} variant="trending" index={i} onPlay={handlePlay} />
        ))}
      </ContentRail>

      <div className="hub-section__divider" />

      {/* Section 4: Intelligence Pulse — the signature moment */}
      <IntelligencePulse activeCategory={activeCategory} isPlaying={isPlaying} />

      <div className="hub-section__divider" />

      <ContentRail title="Future Technologies" id="future-tech">
        {filterRail(futureTech).map((ep, i) => (
          <EpisodeCard key={ep.id} episode={ep} index={i} onPlay={handlePlay} />
        ))}
      </ContentRail>

      <ContentRail title="Startup Stories" id="startup-stories">
        {filterRail(startupStories).map((ep, i) => (
          <EpisodeCard key={ep.id} episode={ep} index={i} onPlay={handlePlay} />
        ))}
      </ContentRail>

      <div className="hub-section__divider" />

      <ContentRail title="Leadership Insights" id="leadership-insights">
        {filterRail(leadershipInsights).map((ep, i) => (
          <EpisodeCard key={ep.id} episode={ep} index={i} onPlay={handlePlay} />
        ))}
      </ContentRail>

      <ContentRail title="Unexpected Conversations" id="unexpected">
        {filterRail(unexpectedConversations).map((ep, i) => (
          <EpisodeCard key={ep.id} episode={ep} variant="surprise" index={i} onPlay={handlePlay} />
        ))}
      </ContentRail>

      <div className="hub-section__divider" />

      {/* Section 5: Conversation Trails */}
      <ConversationTrails />

      {/* Spacer for Now Playing bar */}
      <div style={{ height: '80px' }} />

      {/* Section 6: Now Playing V2 */}
      <NowPlaying track={nowPlayingTrack} />
    </PodcastHubLayout>
  );
}
