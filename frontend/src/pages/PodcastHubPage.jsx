// ─────────────────────────────────────────────────────────
// PodcastHubPage V2 — The Conversation Discovery Engine
// Hierarchy-first layout: hero → search → discovery.
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
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

// Repository Selection
import { ContentRepository } from '@/repositories/ContentRepository';

export default function PodcastHubPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [nowPlayingTrack, setNowPlayingTrack] = useState(null);

  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEpisodes() {
      try {
        const data = await ContentRepository.getAllEpisodes();
        setEpisodes(data);
      } catch (err) {
        console.error('[PodcastHub] Error fetching episodes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEpisodes();
  }, []);

  const handlePlay = useCallback((episode) => {
    setNowPlayingTrack({
      title: episode.title,
      guest: typeof episode.guest === 'string' ? episode.guest : (episode.guest?.name || ''),
      duration: episode.duration || '50:00',
      image: typeof episode.image === 'string' ? episode.image : (episode.image || ''),
      isPlaying: true,
    });
  }, []);

  // Filter episodes dynamically into rails based on active category and topics/metadata
  const getRailEpisodes = useCallback((railId) => {
    return episodes.filter(ep => {
      // Category filter (CategoryPills selection)
      if (activeCategory !== 'all') {
        if (ep.category?.toLowerCase() !== activeCategory.toLowerCase()) {
          return false;
        }
      }

      const category = (ep.category || '').toLowerCase();
      const topics = (ep.topics || []).map(t => t.toLowerCase());

      switch (railId) {
        case 'continue-exploring':
          return true; // All episodes
        case 'most-influential':
          return category === 'startups' || category === 'business';
        case 'founder-picks':
          return category === 'leadership' || topics.includes('growth mindset');
        case 'trending':
          return category === 'business' || topics.includes('healthy snacking') || topics.includes('career gaps');
        case 'future-tech':
          return category === 'future' || category === 'technology' || category === 'ai' || topics.includes('ai') || topics.includes('technology');
        case 'startup-stories':
          return category === 'startups' || topics.includes('startup journey') || topics.includes('entrepreneurship');
        case 'leadership-insights':
          return category === 'leadership' || topics.includes('leadership') || topics.includes('women empowerment') || topics.includes('overcoming adversity');
        case 'unexpected':
          return topics.includes('personal branding') || topics.includes('consumer behavior');
        default:
          return false;
      }
    });
  }, [episodes, activeCategory]);

  const isPlaying = !!nowPlayingTrack?.isPlaying;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Use the latest dynamic episode as featured, or fall back to mock featuredEpisode inside component
  const featured = episodes.length > 0 ? episodes[0] : null;

  return (
    <PodcastHubLayout>
      <AmbientCanvas />

      {/* ═══ V2 HERO ZONE ═══ */}
      <div className="hub-section hub-section--first" style={{ paddingBottom: '1rem' }}>
        <FeaturedConversation episode={featured} onPlay={handlePlay} />
      </div>

      {/* Section 2: Search + Categories */}
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
      {getRailEpisodes('continue-exploring').length > 0 && (
        <ContentRail title="Continue Exploring" id="continue-exploring">
          {getRailEpisodes('continue-exploring').map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} index={i} onPlay={handlePlay} />
          ))}
        </ContentRail>
      )}

      {getRailEpisodes('most-influential').length > 0 && (
        <ContentRail title="Most Influential" id="most-influential">
          {getRailEpisodes('most-influential').map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} variant="influential" index={i} onPlay={handlePlay} />
          ))}
        </ContentRail>
      )}

      <div className="hub-section__divider" />

      {getRailEpisodes('founder-picks').length > 0 && (
        <ContentRail title="Founder Picks" id="founder-picks">
          {getRailEpisodes('founder-picks').map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} index={i} onPlay={handlePlay} />
          ))}
        </ContentRail>
      )}

      {getRailEpisodes('trending').length > 0 && (
        <ContentRail title="Trending Right Now" id="trending">
          {getRailEpisodes('trending').map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} variant="trending" index={i} onPlay={handlePlay} />
          ))}
        </ContentRail>
      )}

      <div className="hub-section__divider" />

      {/* Section 4: Intelligence Pulse */}
      <IntelligencePulse activeCategory={activeCategory} isPlaying={isPlaying} />

      <div className="hub-section__divider" />

      {getRailEpisodes('future-tech').length > 0 && (
        <ContentRail title="Future Technologies" id="future-tech">
          {getRailEpisodes('future-tech').map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} index={i} onPlay={handlePlay} />
          ))}
        </ContentRail>
      )}

      {getRailEpisodes('startup-stories').length > 0 && (
        <ContentRail title="Startup Stories" id="startup-stories">
          {getRailEpisodes('startup-stories').map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} index={i} onPlay={handlePlay} />
          ))}
        </ContentRail>
      )}

      <div className="hub-section__divider" />

      {getRailEpisodes('leadership-insights').length > 0 && (
        <ContentRail title="Leadership Insights" id="leadership-insights">
          {getRailEpisodes('leadership-insights').map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} index={i} onPlay={handlePlay} />
          ))}
        </ContentRail>
      )}

      {getRailEpisodes('unexpected').length > 0 && (
        <ContentRail title="Unexpected Conversations" id="unexpected">
          {getRailEpisodes('unexpected').map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} variant="surprise" index={i} onPlay={handlePlay} />
          ))}
        </ContentRail>
      )}

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
