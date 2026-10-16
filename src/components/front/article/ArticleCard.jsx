import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import fallbackArticleImage from '@/assets/images/source/hero-main.png';
import {
  formatPublicArticleDate,
  getArticleCategoryLabel,
  getArticleTagLabel,
} from '@/utils/publicArticleSelectors';

const ArticleCard = ({ article, listPage = 1 }) => {
  const publishedAt = formatPublicArticleDate(article.create_at);
  const topicTags = [...new Set(
    (Array.isArray(article.tag) ? article.tag : [])
      .filter((tag) => typeof tag === 'string')
      .map((tag) => tag.trim())
      .filter((tag) => tag && tag !== 'plant-care'),
  )].slice(0, 2);

  return (
    <article className="article-card">
      <Link
        to={`/article/${article.id}`}
        state={{ articleListPage: listPage }}
        className="article-card__media"
        aria-label={`閱讀「${article.title}」`}
      >
        <img
          src={article.image || fallbackArticleImage}
          alt=""
          className="article-card__image"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackArticleImage;
          }}
        />
      </Link>

      <div className="article-card__body">
        <div className="article-card__meta">
          <span>{getArticleCategoryLabel(article.articleCategory)}</span>
          {publishedAt && <time dateTime={publishedAt}>{publishedAt}</time>}
        </div>

        <h2 className="article-card__title">
          <Link to={`/article/${article.id}`} state={{ articleListPage: listPage }}>{article.title}</Link>
        </h2>
        {topicTags.length > 0 && (
          <ul className="article-card__topics" aria-label="文章主題">
            {topicTags.map((tag) => (
              <li key={tag}>{getArticleTagLabel(tag)}</li>
            ))}
          </ul>
        )}
        <p className="article-card__description">
          {article.bannerText || article.description || '這篇植栽筆記正在整理中。'}
        </p>

        <Link to={`/article/${article.id}`} state={{ articleListPage: listPage }} className="article-card__link">
          閱讀文章
          <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
