import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Sparkles, Award } from 'lucide-react';

export default function ArticleCard({ article }) {
  // Graceful fallback for subtitle & tags
  const subtitle = article.subtitle || article.excerpt;
  const tags = article.tags || [];

  return (
    <div className="group relative bg-[#0f0f11] border border-emerald-900/20 hover:border-emerald-500/30 rounded-2xl p-6 transition-all hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.1)] flex flex-col h-full z-10 overflow-hidden">
      {/* Decorative radial gradient orb */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] transition-all group-hover:bg-emerald-500/10" />

      {/* Meta Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-emerald-500">
          <BookOpen className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wider uppercase">{article.readingTime || 5} min read</span>
        </div>
        {article.readingLevel && (
          <span className="px-2.5 py-0.5 bg-emerald-500/5 border border-emerald-500/15 rounded-full text-[10px] text-emerald-400 font-medium">
            {article.readingLevel}
          </span>
        )}
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors leading-snug">
        {article.title}
      </h3>
      
      {/* Subtitle */}
      {subtitle && (
        <p className="text-slate-400 text-sm leading-relaxed mb-4 font-light">
          {subtitle}
        </p>
      )}

      {/* Topics / Tags list */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2.5 py-0.5 bg-white/[0.03] border border-white/5 text-slate-500 rounded-full text-[10px] font-medium uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Featured Insight component block */}
      {article.featuredInsight && (
        <div className="bg-emerald-500/[0.01] border-l-2 border-emerald-500/40 p-3.5 rounded-r-xl my-4 text-xs text-slate-350 leading-relaxed font-light flex gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-400 block mb-0.5">Key Insight</span>
            {article.featuredInsight}
          </div>
        </div>
      )}
      
      {/* Read action footer */}
      <div className="flex items-center gap-1.5 text-emerald-500 font-medium text-xs mt-auto pt-4 border-t border-white/5">
        Read Full Article
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </div>

      {/* Full card anchor link directing user to dedicated page */}
      <Link 
        to={`/articles/${article.slug}`} 
        className="absolute inset-0 z-20 cursor-pointer" 
        aria-label={`Read full article: ${article.title}`}
      />
    </div>
  );
}