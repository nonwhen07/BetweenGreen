import { useMemo } from 'react';

// constants
import { ARTICLE_GARDEN_TIPS_LIMIT } from '@/constants/articleConstants';
// hooks
import { usePublicArticles } from '@/hooks/article/usePublicArticles';
// components
import GardenTipCard from '@/components/front/home/GardenTips/GardenTipCard';
// fallback asset
import fallbackGardenTipImage from '@/assets/images/source/hero-main.png';

const GardenTipsSection = () => {
  const { articles, status, error } = usePublicArticles();

  const tips = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);

    return articles
      .filter((article) => {
        const hasStarted = !article.publishStart || article.publishStart <= now;
        const hasNotEnded = !article.publishEnd || article.publishEnd >= now;

        return (
          article.isPublic &&
          article.viewerScope === 'public' &&
          article.displayZone === 'garden-tips' &&
          hasStarted &&
          hasNotEnded
        );
      })
      .sort((left, right) => {
        const priorityDifference =
          Number(right.priorityLevel || 1) - Number(left.priorityLevel || 1);
        if (priorityDifference !== 0) return priorityDifference;
        return Number(right.create_at || 0) - Number(left.create_at || 0);
      })
      .slice(0, ARTICLE_GARDEN_TIPS_LIMIT)
      .map((article) => ({
        id: article.id,
        title: article.title,
        description: article.bannerText || article.description,
        image: article.image || fallbackGardenTipImage,
        fallbackImage: fallbackGardenTipImage,
      }));
  }, [articles]);

  return (
    <section className="garden-tips">
      <div className="container ui-container">
        <div className="section-header text-center mb-5">
          <h2>Garden Tips</h2>
          <p className="text-muted">簡單的園藝技巧，讓你的植物更健康成長</p>
        </div>

        {status === 'loading' && (
          <p className="text-center text-muted">正在載入園藝技巧…</p>
        )}

        {status === 'error' && (
          <p className="text-center text-muted">{error}</p>
        )}

        {status === 'success' && tips.length === 0 && (
          <p className="text-center text-muted">目前尚無公開的園藝技巧文章</p>
        )}

        {tips.length > 0 && (
          <div className="row g-4 mx-0">
            {tips.map((tip) => (
              <div key={tip.id} className="col-md-6 col-lg-4">
                <GardenTipCard tip={tip} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GardenTipsSection;
