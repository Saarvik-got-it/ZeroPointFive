// ─────────────────────────────────────────────────────────
// PodcastHubPage — The Conversation Discovery Engine
// Assembles all hub components into a cohesive page.
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

  // Filter helper — returns true if episode matches active category
  const matchesCategory = useCallback((episode) => {
    if (activeCategory === 'all') return true;
    return episode.category?.toLowerCase() === activeCategory.toLowerCase();
  }, [activeCategory]);

  // Filter each rail (keep at least 2 items for visual continuity)
  const filterRail = useCallback((items) => {
    if (activeCategory === 'all') return items;
    const filtered = items.filter(matchesCategory);
    return filtered.length >= 2 ? filtered : items;
  }, [activeCategory, matchesCategory]);

  return (
    <PodcastHubLayout>
      <AmbientCanvas />

      {/* Section 1: Discovery Search */}
      <div className="hub-section hub-section--first">
        <DiscoverySearch />
      </div>

      {/* Section 2: Category Pills */}
      <div className="hub-section" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
        <CategoryPills
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Section 3: Featured Conversation */}
      <div className="hub-section" style={{ paddingTop: '1rem' }}>
        <FeaturedConversation onPlay={handlePlay} />
      </div>

      <div className="hub-section__divider" />

      {/* Section 4: Content Rails */}
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

      {/* Section 6: Now Playing */}
      <NowPlaying track={nowPlayingTrack} />
    </PodcastHubLayout>
  );
}
