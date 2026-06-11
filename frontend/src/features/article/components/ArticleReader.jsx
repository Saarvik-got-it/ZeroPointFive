import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Check, Quote, Flame } from 'lucide-react';
import './ArticleReader.css';

export default function ArticleReader({ article }) {
  const [activeAnchor, setActiveAnchor] = useState('');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  useEffect(() => {
    // Dynamic page title & metadata update for SEO
    if (article.seo) {
      document.title = article.seo.metaTitle || article.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', article.seo.metaDescription || '');
      }
    }
  }, [article]);

  useEffect(() => {
    if (!article.tableOfContents || article.tableOfContents.length === 0) return;
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      let currentActive = '';
      for (const item of article.tableOfContents) {
        const el = document.getElementById(item.anchorId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentActive = item.anchorId;
          }
        }
      }
      if (currentActive) {
        setActiveAnchor(currentActive);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.tableOfContents]);

  const handleAnchorClick = (e, anchorId) => {
    e.preventDefault();
    const el = document.getElementById(anchorId);
    if (el) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveAnchor(anchorId);
    }
  };

  const formattedDate = article.generatedAt 
    ? new Date(article.generatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

  return (
    <article className="article-reader bg-[#050505] min-h-screen text-slate-200 antialiased selection:bg-emerald-500/30 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/5 to-transparent blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Navigation Header */}
        <header className="mb-12 flex justify-between items-center border-b border-white/5 pb-6">
          <Link 
            to={article.source?.episodeSlug ? `/podcasts/${article.source.episodeSlug}` : '/podcasts'}
            className="group flex items-center gap-2.5 text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Episode</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white/[0.02] border border-white/10 rounded-full text-xs text-slate-400">
              {article.derivedFrom || 'Podcast Conversation'}
            </span>
            {article.readingLevel && (
              <span className={`px-3 py-1 border rounded-full text-xs font-semibold ${
                article.readingLevel === 'Beginner' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                article.readingLevel === 'Intermediate' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                'bg-purple-500/10 border-purple-500/20 text-purple-400'
              }`}>
                {article.readingLevel}
              </span>
            )}
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* Main Content Column */}
          <main className="lg:col-span-8 space-y-10">
            {/* Title Zone */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.15] sm:leading-tight">
                {article.title}
              </h1>
              <p className="text-xl sm:text-2xl text-slate-400 leading-normal font-light">
                {article.subtitle}
              </p>
            </div>

            {/* Author Attribution Meta */}
            <div className="flex items-center gap-4 py-6 border-y border-white/5">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-405 font-bold text-sm">
                0.5
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{article.author || 'The 0.5 Show Editorial'}</div>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{formattedDate}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readingTime} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Introduction */}
            <div className="text-xl text-slate-300 font-normal leading-relaxed mb-8 border-l-2 border-emerald-500/30 pl-4 italic">
              {article.introduction}
            </div>

            {/* Mobile Table of Contents Accordion */}
            {article.tableOfContents && article.tableOfContents.length > 0 && (
              <div className="block lg:hidden bg-[#0f0f11] border border-white/5 rounded-2xl p-4 mb-6 relative z-30">
                <button 
                  onClick={() => setMobileTocOpen(!mobileTocOpen)}
                  className="w-full flex justify-between items-center text-sm font-bold text-slate-300 uppercase tracking-wider cursor-pointer"
                >
                  <span>Table of Contents</span>
                  <svg 
                    className={`w-4 h-4 text-emerald-500 transition-transform duration-200 ${mobileTocOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {mobileTocOpen && (
                  <ul className="mt-4 space-y-2.5 border-t border-white/5 pt-4">
                    {article.tableOfContents.map((item, idx) => (
                      <li key={idx}>
                        <a 
                          href={`#${item.anchorId}`}
                          onClick={(e) => {
                            handleAnchorClick(e, item.anchorId);
                            setMobileTocOpen(false);
                          }}
                          className="block text-sm text-slate-450 hover:text-emerald-400 transition-colors"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Key Takeaways Card Component */}
            {article.keyInsights && article.keyInsights.length > 0 && (
              <section className="bg-emerald-500/[0.02] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 my-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                <h3 className="text-lg font-bold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Flame className="w-5 h-5" /> Key Takeaways
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.keyInsights.map((insight, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">{insight}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Editorial Blocks */}
            <div className="space-y-12 max-w-2xl">
              {article.sections?.map((block, idx) => {
                if (block.type === 'text') {
                  return (
                    <div 
                      key={idx} 
                      id={block.anchorId}
                      className="scroll-mt-24 space-y-4"
                    >
                      {block.heading && (
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-4 border-t border-white/5">
                          {block.heading}
                        </h2>
                      )}
                      <div className="text-slate-300 leading-relaxed text-lg font-light space-y-6">
                        {block.content?.split('\n\n').map((p, pIdx) => (
                          <p key={pIdx} className="paragraph-text">
                            {p.trim()}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                } else if (block.type === 'insight') {
                  return (
                    <div 
                      key={idx}
                      className="bg-white/[0.02] border-l-4 border-emerald-500/60 p-6 rounded-r-2xl my-6"
                    >
                      <h4 className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-2">Deep Insight</h4>
                      <p className="text-lg text-slate-200 font-medium leading-relaxed italic">
                        "{block.content}"
                      </p>
                    </div>
                  );
                } else if (block.type === 'quote') {
                  return (
                    <div 
                      key={idx}
                      className="my-10 p-6 sm:p-8 rounded-3xl bg-[#0f0f11] border border-white/5 relative"
                    >
                      <Quote className="absolute top-4 left-4 w-12 h-12 text-emerald-500/10 pointer-events-none" />
                      <blockquote className="text-xl sm:text-2xl font-serif italic text-white leading-relaxed relative z-10 mb-4">
                        "{block.content}"
                      </blockquote>
                      {block.context && (
                        <cite className="block text-sm text-slate-400 not-italic border-t border-white/5 pt-4 font-light">
                          <span className="font-semibold text-emerald-500">Context:</span> {block.context}
                        </cite>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Podcast Moments Component */}
            {article.podcastMoments && article.podcastMoments.length > 0 && (
              <section className="border-t border-white/10 pt-10 mt-12 space-y-6">
                <h3 className="text-2xl font-bold text-white tracking-tight">Podcast Moments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {article.podcastMoments.map((moment, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                      <h4 className="text-base font-bold text-slate-200 mb-2">{moment.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed font-light">{moment.summary}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Quote Highlights Bottom Component */}
            {article.quoteHighlights && article.quoteHighlights.length > 0 && (
              <section className="border-t border-white/10 pt-10 mt-12 space-y-6">
                <h3 className="text-2xl font-bold text-white tracking-tight">Memorable Quotes</h3>
                <div className="space-y-4">
                  {article.quoteHighlights.map((qh, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-[#0e0e10] border-l-4 border-emerald-500/40 space-y-2">
                      <p className="text-base text-white italic font-serif leading-relaxed">"{qh.quote}"</p>
                      <span className="block text-xs text-slate-400">{qh.context}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Conclusion */}
            {article.conclusion && (
              <section className="border-t border-white/10 pt-10 mt-12 space-y-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">Conclusion</h3>
                <p className="text-slate-300 leading-relaxed text-lg font-light">
                  {article.conclusion}
                </p>
              </section>
            )}

            {/* Footer Navigation */}
            <footer className="border-t border-white/10 pt-10 mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {article.tags?.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-white/5 text-slate-400 rounded-full text-xs font-medium border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <Link 
                to={article.source?.episodeSlug ? `/podcasts/${article.source.episodeSlug}` : '/podcasts'}
                className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-semibold transition-colors"
              >
                Back to Episode
                <ArrowRight className="w-4 h-4" />
              </Link>
            </footer>
          </main>

          {/* Sticky Sidebar (Table of Contents & Episode Source) */}
          <aside className="lg:col-span-4 space-y-8 hidden lg:block">
            <div className="sticky top-28 space-y-8">
              
              {/* Table of Contents Section */}
              {article.tableOfContents && article.tableOfContents.length > 0 && (
                <div className="p-6 rounded-2xl bg-[#0f0f11]/60 backdrop-blur-md border border-white/5 shadow-md">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Table of Contents</h4>
                  <ul className="space-y-3">
                    {article.tableOfContents.map((item, idx) => (
                      <li key={idx}>
                        <a 
                          href={`#${item.anchorId}`}
                          onClick={(e) => handleAnchorClick(e, item.anchorId)}
                          className={`block text-sm transition-all hover:text-emerald-400 ${
                            activeAnchor === item.anchorId 
                              ? 'text-emerald-400 font-bold border-l-2 border-emerald-500 pl-3 translate-x-1' 
                              : 'text-slate-400 pl-3 border-l border-white/5'
                          }`}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Source Episode Card */}
              {article.source && (
                <div className="p-6 rounded-2xl bg-[#0f0f11]/60 backdrop-blur-md border border-white/5 shadow-md space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Source Podcast</h4>
                  {article.source.episodeThumbnail && (
                    <img 
                      src={article.source.episodeThumbnail} 
                      alt="Episode Thumbnail" 
                      className="w-full h-32 object-cover rounded-xl border border-white/5"
                    />
                  )}
                  <div>
                    <h5 className="text-sm font-bold text-slate-200 leading-snug">{article.source.episodeTitle}</h5>
                    <p className="text-xs text-slate-500 mt-1">Originally published conversation</p>
                  </div>
                  <Link 
                    to={`/podcasts/${article.source.episodeSlug}`}
                    className="block w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-center text-sm font-bold rounded-xl transition-all shadow-md"
                  >
                    Go to Episode Hub
                  </Link>
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>
    </article>
  );
}

// Inline ArrowRight helper
function ArrowRight(props) {
  return (
    <svg 
      {...props}
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
