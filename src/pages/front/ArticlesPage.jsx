import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

import { usePublicArticles } from '@/hooks/article/usePublicArticles';
import {
  isPublicArticleAvailable,
  sortArticlesByNewest,
} from '@/utils/publicArticleSelectors';

import PageHero from '@/components/shared/PageHero';
import ArticleCard from '@/components/front/article/ArticleCard';
import BrandPagination from '@/components/shared/BrandPagination';
// 暫用既有圖片；正式文章頁首圖留待集中圖片整合時替換。
import { SITE_ASSETS } from '@/constants/siteAssets';

const ARTICLES_PER_PAGE = 6;

const ArticlesPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawPage = searchParams.get('page');
  const parsedPage = Number(rawPage);
  const requestedPage = /^[1-9]\d*$/.test(rawPage || '') && Number.isSafeInteger(parsedPage)
    ? parsedPage : 1;
  const listHeadingRef = useRef(null);
  const scrollToListRef = useRef(requestedPage > 1 || location.state?.articleListReturn === true);
  const previousLocationKeyRef = useRef(location.key);
  const { articles, status, error, fetchArticles, loadedAt } = usePublicArticles();
  const publicArticles = useMemo(
    () =>
      sortArticlesByNewest(
        articles.filter((article) =>
          isPublicArticleAvailable(article, { now: loadedAt }),
        ),
      ),
    [articles, loadedAt],
  );

  const isLoading = status === 'idle' || status === 'loading';
  const totalPages = Math.max(1, Math.ceil(publicArticles.length / ARTICLES_PER_PAGE));
  const page = Math.min(requestedPage, totalPages);
  const pageStart = (page - 1) * ARTICLES_PER_PAGE;
  const visibleArticles = publicArticles.slice(pageStart, pageStart + ARTICLES_PER_PAGE);

  useEffect(() => {
    if (status !== 'success') return;
    const canonicalPage = page === 1 ? null : String(page);
    if (rawPage === canonicalPage) return;
    const nextParams = new URLSearchParams(searchParams);
    if (canonicalPage) nextParams.set('page', canonicalPage);
    else nextParams.delete('page');
    setSearchParams(nextParams, { replace: true, state: location.state });
  }, [status, page, rawPage, searchParams, setSearchParams, location.state]);

  useEffect(() => {
    if (previousLocationKeyRef.current !== location.key) {
      previousLocationKeyRef.current = location.key;
      scrollToListRef.current = true;
    }
    if (status !== 'success' || !scrollToListRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      const heading = listHeadingRef.current;
      if (!heading) return;
      const headerHeight = document.querySelector('.front-header')?.getBoundingClientRect().height || 0;
      const clearance = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
      ) || 0;
      window.scrollTo({
        top: Math.max(0, window.scrollY + heading.getBoundingClientRect().top - Math.max(headerHeight, clearance) - 16),
        behavior: 'instant',
      });
      heading.focus({ preventScroll: true });
      scrollToListRef.current = false;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [status, page, location.key]);

  const handlePageChange = (nextPage) => {
    if (nextPage === page) return;
    scrollToListRef.current = true;
    const nextParams = new URLSearchParams(searchParams);
    if (nextPage === 1) nextParams.delete('page');
    else nextParams.set('page', String(nextPage));
    setSearchParams(nextParams);
  };

  return (
    <div className="articles-page">
      <PageHero
        eyebrow="Plant Care Journal"
        title="植栽生活筆記"
        titleId="articles-page-title"
        text="從光照、澆水到換盆，整理植物與日常共處時值得慢慢讀懂的細節。"
        backgroundAsset={SITE_ASSETS.homeHeroDesk}
        imagePosition="center 58%"
        variant="subpage"
        className="page-hero--articles"
        tone="warm"
        align="left"
        size="md"
      />

      <section
        className="articles-page__section ui-section ui-section--tight"
        aria-labelledby="articles-list-title"
      >
        <div className="ui-container">
          <header className="articles-page__header">
            <div>
              <p className="articles-page__eyebrow">Latest Notes</p>
              <h2 ref={listHeadingRef} tabIndex={-1} id="articles-list-title" className="articles-page__title">
                最近的植栽提案
              </h2>
            </div>
            {!isLoading && status !== 'error' && (
              <p className="articles-page__count">共 {publicArticles.length} 篇</p>
            )}
          </header>

          {isLoading && (
            <div className="articles-page__state" role="status" aria-live="polite">
              <span className="articles-page__state-dot" aria-hidden="true" />
              <p>正在整理植栽筆記…</p>
            </div>
          )}

          {status === 'error' && (
            <div className="articles-page__state articles-page__state--error" role="alert">
              <RefreshCw size={26} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <h2>文章暫時無法載入</h2>
                <p>{error || '請稍後再試。'}</p>
              </div>
              <button
                type="button"
                className="ui-btn ui-btn--outline-primary"
                onClick={fetchArticles}
              >
                再試一次
              </button>
            </div>
          )}

          {status === 'success' && publicArticles.length === 0 && (
            <div className="articles-page__state" role="status">
              <p>新的植栽筆記正在準備中。</p>
            </div>
          )}

          {publicArticles.length > 0 && (
            <div className="articles-page__grid">
              {visibleArticles.map((article) => (
                <ArticleCard key={article.id} article={article} listPage={page} />
              ))}
            </div>
          )}
          {status === 'success' && totalPages > 1 && (
            <div className="articles-page__pagination">
              <p className="articles-page__page-count" aria-live="polite">
                第 {pageStart + 1}–{Math.min(pageStart + ARTICLES_PER_PAGE, publicArticles.length)} 篇／共 {publicArticles.length} 篇
              </p>
              <BrandPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="articles-page__page-nav"
                ariaLabel="植栽筆記分頁"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ArticlesPage;

