import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, Hash, Info, Beaker } from 'lucide-react';
import EpisodeHero from '../features/episode/components/EpisodeHero';
import ContentSection from '../features/episode/components/ContentSection';
import ArticleCard from '../features/episode/components/ArticleCard';
import TranscriptViewer from '../features/episode/components/TranscriptViewer';

export default function EpisodeDetailPage() {
  const { slug } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEpisode() {
      try {
        const res = await fetch(`http://localhost:5000/api/episodes/${slug}`);
        if (!res.ok) {
          throw new Error('Episode not found');
        }
        const data = await res.json();
        setEpisode(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEpisode();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <Beaker className="w-16 h-16 text-emerald-500 mb-6 opacity-50" />
        <h1 className="text-3xl font-bold text-white mb-4">Episode Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-md">We couldn't track down this signal. Either it's still being processed or it was lost in the void.</p>
        <Link to="/podcasts" className="text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-emerald-500/30">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/podcasts" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Episodes
        </Link>

        <EpisodeHero 
          title={episode.title}
          thumbnail={episode.thumbnail}
          publishedAt={episode.createdAt}
          youtubeUrl={episode.youtubeUrl}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            <ContentSection title="Executive Summary" icon={<Info className="w-6 h-6" />}>
              <div className="bg-[#0f0f11] rounded-2xl p-6 md:p-8 border border-white/5 shadow-inner">
                <p className="text-lg text-slate-300 leading-relaxed font-light">
                  {episode.summary}
                </p>
              </div>
            </ContentSection>

            <ContentSection title="Key Takeaways" icon={<Target className="w-6 h-6" />}>
              <div className="space-y-4">
                {episode.takeaways?.map((takeaway, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors group">
                    <div className="text-emerald-500 font-bold text-xl opacity-50 group-hover:opacity-100 transition-opacity">
                      {idx + 1}.
                    </div>
                    <p className="text-slate-300 leading-relaxed pt-1">
                      {takeaway}
                    </p>
                  </div>
                ))}
              </div>
            </ContentSection>

            <TranscriptViewer transcript={episode.transcript} />
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            <div className="sticky top-8">
              <ContentSection title="Signals & Topics" icon={<Hash className="w-6 h-6" />}>
                <div className="flex flex-wrap gap-2">
                  {episode.topics?.map((topic, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/20"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </ContentSection>

              {episode.articles && episode.articles.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Extracted Intel</h3>
                  <div className="space-y-6">
                    {episode.articles.map((article, idx) => (
                      <ArticleCard 
                        key={article.id || idx} 
                        article={article} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}