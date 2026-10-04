import {
  ARTICLE_CATEGORY_MAP,
  ARTICLE_TAG_MAP,
} from '@/constants/articleConstants';

export const isTruthyArticleFlag = (value) =>
  value === true || value === 1 || value === '1' || value === 'true';

const getUnixTimestamp = (value) => {
  if (value === '' || value === null || value === undefined) return null;

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

export const isPublicArticleAvailable = (
  article,
  { now = Math.floor(Date.now() / 1000), displayZone } = {},
) => {
  if (!article || !isTruthyArticleFlag(article.isPublic)) return false;
  if (article.viewerScope !== 'public') return false;
  if (displayZone && article.displayZone !== displayZone) return false;

  const publishStart = getUnixTimestamp(article.publishStart);
  const publishEnd = getUnixTimestamp(article.publishEnd);

  return (!publishStart || publishStart <= now) && (!publishEnd || publishEnd >= now);
};

export const sortArticlesByPriorityAndDate = (articles) =>
  [...articles].sort((left, right) => {
    const priorityDifference =
      Number(right?.priorityLevel || 1) - Number(left?.priorityLevel || 1);
    if (priorityDifference !== 0) return priorityDifference;

    return Number(right?.create_at || 0) - Number(left?.create_at || 0);
  });

export const sortArticlesByNewest = (articles) =>
  [...articles].sort(
    (left, right) => Number(right?.create_at || 0) - Number(left?.create_at || 0),
  );

export const getArticleCategoryLabel = (category, { short = false } = {}) => {
  const categoryOption = Object.values(ARTICLE_CATEGORY_MAP).find(
    (item) => item.value === category,
  );

  return categoryOption?.[short ? 'shortLabel' : 'label'] || '植栽筆記';
};

export const getArticleTagLabel = (tag) =>
  Object.values(ARTICLE_TAG_MAP).find((item) => item.value === tag)?.label || tag;

export const formatPublicArticleDate = (timestamp) => {
  const unixTimestamp = getUnixTimestamp(timestamp);
  if (!unixTimestamp) return '';

  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(unixTimestamp * 1000));
};
