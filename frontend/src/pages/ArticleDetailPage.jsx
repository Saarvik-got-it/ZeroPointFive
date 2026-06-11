import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Beaker } from 'lucide-react';
import ArticleReader from '../features/article/components/ArticleReader';
import { ContentRepository } from '@/repositories/ContentRepository';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        const data = await ContentRepository.getArticleBySlug(slug);
        if (!data) {
          throw new Error('Article not found');
        }
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-emerald-500/5 to-transparent blur-[120px]" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-550 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-xs tracking-widest uppercase font-semibold">Tuning Signal...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-emerald-500/5 to-transparent blur-[120px]" />
        <div className="relative z-10">
          <Beaker className="w-16 h-16 text-emerald-500 mb-6 opacity-30 mx-auto" />
          <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Article Not Found</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto font-light leading-relaxed">
            We couldn't locate this publication. It may still be generating or was removed.
          </p>
          <Link 
            to="/podcasts" 
            className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>
        </div>
      </div>
    );
  }

  return <ArticleReader article={article} />;
}
