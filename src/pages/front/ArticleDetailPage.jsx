import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';

import fallbackArticleImage from '@/assets/images/source/hero-main.png';
import { getArticle } from '@/services/articleService';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
  formatPublicArticleDate,
  getArticleCategoryLabel,
  getArticleTagLabel,
  isPublicArticleAvailable,
} from '@/utils/publicArticleSelectors';

const ArticleDetailPage = () => {
  const location = useLocation();
  const originPage = location.state?.articleListPage;
  const returnTo = Number.isSafeInteger(originPage) && originPage > 1
    ? `/articles?page=${originPage}` : '/articles';
  const { article_id: articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const fetchArticle = useCallback(async () => {
    setStatus('loading');
    setError('');

    try {
      const response = await getArticle(articleId);
      const nextArticle = response.data
        ? { ...response.data, id: response.data.id || articleId }
        : null;

      if (!nextArticle || !isPublicArticleAvailable(nextArticle)) {
        setArticle(null);
        setStatus('not-found');
        return;
      }

      setArticle(nextArticle);
      setStatus('success');
    } catch (requestError) {
      if (requestError?.response?.status === 404) {
        setStatus('not-found');
        return;
      }

      setError(extractErrorMessage(requestError, null, '取得文章內容失敗'));
      setStatus('error');
    }
  }, [articleId]);

  useEffect(() => {
    const requestTimer = window.setTimeout(fetchArticle, 0);
    return () => window.clearTimeout(requestTimer);
  }, [fetchArticle]);

  if (status === 'loading') {
    return (
      <div className="article-detail-page">
        <div className="article-detail-page__state" role="status" aria-live="polite">
          <span className="articles-page__state-dot" aria-hidden="true" />
          <p>正在展開植栽筆記…</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="article-detail-page">
        <div className="article-detail-page__state" role="alert">
          <RefreshCw size={28} strokeWidth={1.5} aria-hidden="true" />
          <h1>文章暫時無法載入</h1>
          <p>{error}</p>
          <button type="button" className="ui-btn ui-btn--primary" onClick={fetchArticle}>
            再試一次
          </button>
        </div>
      </div>
    );
  }

  if (status === 'not-found') {
    return (
      <div className="article-detail-page">
        <div className="article-detail-page__state">
          <p className="article-detail-page__eyebrow">Journal Note</p>
          <h1>這篇文章目前無法閱讀</h1>
          <p>文章可能尚未公開、已結束展示，或連結不存在。</p>
          <Link to={returnTo} state={{ articleListReturn: true }} className="ui-btn ui-btn--primary">
            返回文章列表
          </Link>
        </div>
      </div>
    );
  }

  const publishedAt = formatPublicArticleDate(article.create_at);
  const tags = Array.isArray(article.tag) ? article.tag.filter(Boolean) : [];
  const content = typeof article.content === 'string' ? article.content.trim() : '';

  return (
    <article className="article-detail-page">
      <div className="ui-container article-detail-page__container">
        <Link to={returnTo} state={{ articleListReturn: true }} className="article-detail-page__back-link">
          <ArrowLeft size={17} strokeWidth={1.7} aria-hidden="true" />
          返回植栽筆記
        </Link>

        <header className="article-detail-page__header">
          <p className="article-detail-page__eyebrow">
            {getArticleCategoryLabel(article.articleCategory)}
          </p>
          <h1 className="article-detail-page__title">{article.title}</h1>
          <p className="article-detail-page__lead">
            {article.bannerText || article.description}
          </p>
          <div className="article-detail-page__meta">
            <span>By {article.author || 'Between Green 編輯部'}</span>
            {publishedAt && <time dateTime={publishedAt}>{publishedAt}</time>}
          </div>
        </header>

        <figure className="article-detail-page__figure">
          <img
            src={article.image || fallbackArticleImage}
            alt=""
            className="article-detail-page__image"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackArticleImage;
            }}
          />
        </figure>

        <div className="article-detail-page__body">
          {content ? (
            <div className="article-detail-page__content">{content}</div>
          ) : (
            <div className="article-detail-page__content-pending" role="note">
              <p className="article-detail-page__eyebrow">Content in progress</p>
              <h2>完整文章內容正在整理中</h2>
              <p>
                目前先保留文章摘要；待後台補上 content 後，這裡會直接顯示完整內容。
              </p>
            </div>
          )}

          {tags.length > 0 && (
            <ul className="article-detail-page__tags" aria-label="文章標籤">
              {tags.map((tag) => (
                <li key={tag}>{getArticleTagLabel(tag)}</li>
              ))}
            </ul>
          )}
          <nav className="article-detail-page__end-nav" aria-label="文章閱讀導覽">
            <Link
              to={returnTo}
              state={{ articleListReturn: true }}
              className="article-detail-page__back-link article-detail-page__back-link--end"
            >
              <ArrowLeft size={17} strokeWidth={1.7} aria-hidden="true" />
              返回植栽筆記
            </Link>
          </nav>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetailPage;
