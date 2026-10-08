import { useMemo } from 'react';
import { RefreshCw } from 'lucide-react';

import { usePublicArticles } from '@/hooks/article/usePublicArticles';
import {
  isPublicArticleAvailable,
  sortArticlesByNewest,
} from '@/utils/publicArticleSelectors';

import PageHero from '@/components/shared/PageHero';
import ArticleCard from '@/components/front/article/ArticleCard';

const ArticlesPage = () => {
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

  return (
    <div className="articles-page">
      <PageHero
        eyebrow="Plant Care Journal"
        title="植栽生活筆記"
        titleId="articles-page-title"
        text="從光照、澆水到換盆，整理植物與日常共處時值得慢慢讀懂的細節。"
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
              <h2 id="articles-list-title" className="articles-page__title">
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
              {publicArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ArticlesPage;
