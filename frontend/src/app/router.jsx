import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import PodcastHubPage from '@/pages/PodcastHubPage';
import EpisodeDetailPage from '@/pages/EpisodeDetailPage';
import ArticleDetailPage from '@/pages/ArticleDetailPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/podcasts" element={<PodcastHubPage />} />
        <Route path="/podcasts/:slug" element={<EpisodeDetailPage />} />
        <Route path="/articles/:slug" element={<ArticleDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
