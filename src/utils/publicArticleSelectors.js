import {
  ARTICLE_CATEGORY_MAP,
  ARTICLE_GARDEN_TIPS_LIMIT,
  ARTICLE_TAG_MAP,
} from '@/constants/articleConstants';

export const isTruthyArticleFlag = (value) =>
  value === true || value === 1 || value === '1';

export const hasArticleId = (article) =>
  typeof article?.id === 'string' && article.id.trim().length > 0;

const getUnixTimestamp = (value) => {
  if (value === '' || value === null || value === undefined) return null;

  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && !value.trim()) return null;
  const numericValue = Number(value);
  return Number.isInteger(numericValue) && numericValue > 0 &&
    !Number.isNaN(new Date(numericValue * 1000).getTime())
    ? numericValue
    : null;
};

const taipeiDateFormatter = new Intl.DateTimeFormat('en', {
  timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
});

const getCurrentDateKey = (timestamp) => {
  const parts = taipeiDateFormatter.formatToParts(new Date(timestamp * 1000));
  const getPart = (type) => Number(parts.find((part) => part.type === type)?.value);
  return getPart('year') * 10000 + getPart('month') * 100 + getPart('day');
};

// 既有 date input formatter 以 UTC 儲存 YYYY-MM-DD；沿用該日期，
// 再與台灣當日比較，避免更改既有資料或因訪客時區改變截止日。
const getStoredDateKey = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.getUTCFullYear() * 10000 + (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
};

export const getArticleScheduleState = (article, now = Math.floor(Date.now() / 1000)) => {
  const hasStart = article?.publishStart !== '' && article?.publishStart != null;
  const hasEnd = article?.publishEnd !== '' && article?.publishEnd != null;
  const start = getUnixTimestamp(article?.publishStart);
  const end = getUnixTimestamp(article?.publishEnd);
  const startDay = start === null ? null : getStoredDateKey(start);
  const endDay = end === null ? null : getStoredDateKey(end);
  const isValid = (!hasStart || start !== null) && (!hasEnd || end !== null) &&
    (startDay === null || endDay === null || endDay >= startDay);
  const today = getCurrentDateKey(now);

  return {
    hasStart,
    hasEnd,
    isValid,
    isScheduled: isValid && startDay !== null && today < startDay,
    isExpired: isValid && endDay !== null && today > endDay,
  };
};

export const isPublicArticleAvailable = (
  article,
  { now = Math.floor(Date.now() / 1000), displayZone } = {},
) => {
  if (!hasArticleId(article) || !isTruthyArticleFlag(article.isPublic)) return false;
  if (article.viewerScope !== 'public') return false;
  if (displayZone && article.displayZone !== displayZone) return false;

  const schedule = getArticleScheduleState(article, now);
  return schedule.isValid && !schedule.isScheduled && !schedule.isExpired;
};

export const sortArticlesByPriorityAndDate = (articles) =>
  [...articles].sort((left, right) => {
    const priorityDifference =
      Number(right?.priorityLevel || 1) - Number(left?.priorityLevel || 1);
    if (priorityDifference !== 0) return priorityDifference;

    return Number(right?.create_at || 0) - Number(left?.create_at || 0);
  });

export const getGardenTipsCandidates = (articles, now = Math.floor(Date.now() / 1000)) =>
  sortArticlesByPriorityAndDate(
    articles.filter((article) =>
      isPublicArticleAvailable(article, { now, displayZone: 'garden-tips' }),
    ),
  );

export const selectGardenTipsArticles = (articles, now = Math.floor(Date.now() / 1000)) => {
  const candidates = getGardenTipsCandidates(articles, now);
  const featured = candidates
    .filter((article) => isTruthyArticleFlag(article.isFeatured))
    .slice(0, ARTICLE_GARDEN_TIPS_LIMIT);
  const featuredIds = new Set(featured.map((article) => article.id));
  const fallback = candidates
    .filter((article) => !featuredIds.has(article.id))
    .slice(0, Math.max(ARTICLE_GARDEN_TIPS_LIMIT - featured.length, 0));
  return [...featured, ...fallback];
};

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
