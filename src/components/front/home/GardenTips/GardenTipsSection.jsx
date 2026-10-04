import { useEffect, useMemo, useState } from 'react';

// constants
import { ARTICLE_GARDEN_TIPS_LIMIT } from '@/constants/articleConstants';
import { BREAKPOINTS } from '@/constants/breakpoints';
// hooks
import { usePublicArticles } from '@/hooks/article/usePublicArticles';
import {
  isPublicArticleAvailable,
  isTruthyArticleFlag,
  sortArticlesByPriorityAndDate,
} from '@/utils/publicArticleSelectors';
// components
import GardenTipCard from '@/components/front/home/GardenTips/GardenTipCard';
import GardenTipDetails from '@/components/front/home/GardenTips/GardenTipDetails';
// fallback asset
import fallbackGardenTipImage from '@/assets/images/source/hero-main.png';

const pageLoadedAt = Math.floor(Date.now() / 1000);
const desktopMediaQuery = `(min-width: ${BREAKPOINTS.desktop}px)`;
const tabletMediaQuery = `(min-width: ${BREAKPOINTS.tablet}px)`;
const getIsDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia(desktopMediaQuery).matches;
const getIsBelowTablet = () =>
  typeof window !== 'undefined' && !window.matchMedia(tabletMediaQuery).matches;

const GardenTipsSection = () => {
  const { articles, status, error, fetchArticles } = usePublicArticles();
  const [activeTipId, setActiveTipId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);
  const [isBelowTablet, setIsBelowTablet] = useState(getIsBelowTablet);

  useEffect(() => {
    const mediaQuery = window.matchMedia(desktopMediaQuery);
    const handleViewportChange = (event) => {
      setIsDesktop(event.matches);
      if (event.matches) setActiveTipId(null);
    };

    mediaQuery.addEventListener('change', handleViewportChange);

    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(tabletMediaQuery);
    const handleViewportChange = (event) => {
      setIsBelowTablet(!event.matches);
      setActiveTipId(null);
    };

    mediaQuery.addEventListener('change', handleViewportChange);

    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  const tips = useMemo(() => {
    const eligibleArticles = sortArticlesByPriorityAndDate(
      articles.filter((article) =>
        isPublicArticleAvailable(article, {
          now: pageLoadedAt,
          displayZone: 'garden-tips',
        }),
      ),
    );

    const featuredArticles = eligibleArticles
      .filter((article) => isTruthyArticleFlag(article.isFeatured))
      .slice(0, ARTICLE_GARDEN_TIPS_LIMIT);
    const featuredIds = new Set(featuredArticles.map((article) => article.id));
    const fallbackArticles = eligibleArticles
      .filter((article) => !featuredIds.has(article.id))
      .slice(0, Math.max(ARTICLE_GARDEN_TIPS_LIMIT - featuredArticles.length, 0));
    const selectedArticles = [...featuredArticles, ...fallbackArticles];

    return selectedArticles.map((article) => ({
      id: article.id,
      title: article.title,
      description: article.bannerText || article.description,
      image: article.image || fallbackGardenTipImage,
      fallbackImage: fallbackGardenTipImage,
      author: article.author || 'Between Green 編輯部',
      category: article.articleCategory,
    }));
  }, [articles]);

  const activeTip = tips.find((tip) => tip.id === activeTipId) || null;
  const activeTipIndex = tips.findIndex((tip) => tip.id === activeTipId);
  const showSharedMobileDetail = isBelowTablet && activeTip && activeTipIndex > 0;
  const sharedDetailId = 'garden-tip-mobile-details';

  return (
    <section
      className="ui-section garden-tips-section"
      aria-labelledby="garden-tips-title"
      onClick={() => setActiveTipId(null)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setActiveTipId(null);
      }}
    >
      <div className="ui-container">
        <header className="garden-tips-section__header">
          <p className="garden-tips-section__eyebrow">Plant Care Journal</p>
          <h2 id="garden-tips-title" className="garden-tips-section__title">
            Garden Tips
          </h2>
          <p className="garden-tips-section__intro">
            從光照、澆水到換盆，陪你讀懂植物每天的小變化。
          </p>
        </header>

        {status === 'loading' && (
          <div className="garden-tips-section__state" role="status" aria-live="polite">
            <span className="garden-tips-section__state-dot" aria-hidden="true" />
            <p>正在整理植栽筆記…</p>
          </div>
        )}

        {status === 'error' && (
          <div
            className="garden-tips-section__state garden-tips-section__state--error"
            role="alert"
          >
            <p>{error}</p>
            <button
              type="button"
              className="ui-btn ui-btn--outline-primary"
              onClick={fetchArticles}
            >
              重新載入
            </button>
          </div>
        )}

        {status === 'success' && tips.length === 0 && (
          <div className="garden-tips-section__state" role="status">
            <p>新的植栽筆記正在準備中。</p>
          </div>
        )}

        {tips.length > 0 && (
          <div className="garden-tips-section__grid">
            {tips.map((tip, index) => (
              <GardenTipCard
                key={tip.id}
                tip={tip}
                isActive={activeTipId === tip.id}
                isDesktop={isDesktop}
                showInlineDetails={!isBelowTablet || index === 0}
                detailId={isBelowTablet && index > 0 ? sharedDetailId : undefined}
                onToggle={() =>
                  setActiveTipId((currentId) => (currentId === tip.id ? null : tip.id))
                }
              />
            ))}

            {showSharedMobileDetail && (
              <div
                id={sharedDetailId}
                className="garden-tips-section__mobile-detail"
                onClick={(event) => event.stopPropagation()}
              >
                <GardenTipDetails tip={activeTip} onClose={() => setActiveTipId(null)} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default GardenTipsSection;
