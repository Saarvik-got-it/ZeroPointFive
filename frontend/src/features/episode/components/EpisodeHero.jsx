import { Play, Calendar, Share2 } from 'lucide-react';

export default function EpisodeHero({ title, thumbnail, publishedAt, youtubeUrl }) {
  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] lg:aspect-[24/9] rounded-2xl overflow-hidden mb-12 shadow-2xl group">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${thumbnail})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{title}</h1>
          <div className="flex items-center gap-4 text-emerald-400 text-sm font-medium">
            <span className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-emerald-500/20">
              <Calendar className="w-4 h-4" />
              {new Date(publishedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Play className="w-5 h-5 fill-current" />
            Watch on YouTube
          </a>
          <button className="p-4 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}