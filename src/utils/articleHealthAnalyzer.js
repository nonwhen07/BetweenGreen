import {
  ARTICLE_CATEGORY_MAP,
  ARTICLE_DISPLAY_ZONE_MAP,
  ARTICLE_PRIORITY_MAP,
  ARTICLE_TAG_MAP,
  ARTICLE_VIEWER_SCOPE_MAP,
} from '@/constants/articleConstants';

export const ARTICLE_HEALTH_STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  ERROR: 'error',
};

export const ARTICLE_HEALTH_ISSUE_MAP = {
  MISSING_REQUIRED: {
    label: '必填內容不完整',
    severity: ARTICLE_HEALTH_STATUS.ERROR,
  },
  DUPLICATE_TITLE: {
    label: '文章標題重複',
    severity: ARTICLE_HEALTH_STATUS.ERROR,
  },
  INVALID_TAXONOMY: {
    label: '分類或投放設定異常',
    severity: ARTICLE_HEALTH_STATUS.ERROR,
  },
  INVALID_TAGS: {
    label: '文章標籤異常',
    severity: ARTICLE_HEALTH_STATUS.ERROR,
  },
  INVALID_DATE: {
    label: '日期資料異常',
    severity: ARTICLE_HEALTH_STATUS.ERROR,
  },
  INVALID_PUBLIC_STATUS: {
    label: '公開狀態異常',
    severity: ARTICLE_HEALTH_STATUS.ERROR,
  },
  INVALID_IMAGE: {
    label: '封面網址異常',
    severity: ARTICLE_HEALTH_STATUS.ERROR,
  },
  EXPIRED_PUBLIC: {
    label: '已下架但仍設為公開',
    severity: ARTICLE_HEALTH_STATUS.ERROR,
  },
  SCOPE_MISMATCH: {
    label: '公開與顯示對象衝突',
    severity: ARTICLE_HEALTH_STATUS.ERROR,
  },
  DRAFT: {
    label: '文章仍為草稿',
    severity: ARTICLE_HEALTH_STATUS.WARNING,
  },
  SCHEDULED: {
    label: '文章尚未開始上架',
    severity: ARTICLE_HEALTH_STATUS.WARNING,
  },
  EXPIRED: {
    label: '文章已超過下架日',
    severity: ARTICLE_HEALTH_STATUS.WARNING,
  },
  MISSING_IMAGE: {
    label: '尚未設定封面圖片',
    severity: ARTICLE_HEALTH_STATUS.WARNING,
  },
  MISSING_TAGS: {
    label: '尚未設定文章標籤',
    severity: ARTICLE_HEALTH_STATUS.WARNING,
  },
  NO_PUBLISH_START: {
    label: '未設定上架開始日',
    severity: ARTICLE_HEALTH_STATUS.WARNING,
  },
};

const CATEGORY_VALUES = new Set(
  Object.values(ARTICLE_CATEGORY_MAP).map((item) => item.value),
);
const SCOPE_VALUES = new Set(
  Object.values(ARTICLE_VIEWER_SCOPE_MAP).map((item) => item.value),
);
const PRIORITY_VALUES = new Set(
  Object.values(ARTICLE_PRIORITY_MAP).map((item) => item.value),
);
const ZONE_VALUES = new Set(
  Object.values(ARTICLE_DISPLAY_ZONE_MAP).map((item) => item.value),
);
const TAG_VALUES = new Set(
  Object.values(ARTICLE_TAG_MAP).map((item) => item.value),
);

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const isValidTimestamp = (value) => Number.isInteger(value) && value > 0;

const isValidHttpUrl = (value) => {
  if (!isNonEmptyString(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const getDayStart = (dateValue) => {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const addIssue = (issues, code, message) => {
  const definition = ARTICLE_HEALTH_ISSUE_MAP[code];

  issues.push({
    code,
    label: definition.label,
    severity: definition.severity,
    message,
  });
};

const getDuplicateTitleSet = (articles) => {
  const counts = articles.reduce((result, article) => {
    if (!isNonEmptyString(article.title)) return result;
    const title = article.title.trim().toLowerCase();
    result.set(title, (result.get(title) || 0) + 1);
    return result;
  }, new Map());
  return new Set(
    [...counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([title]) => title),
  );
};

const analyzeSingleArticle = (article, duplicateTitles, now) => {
  const issues = [];
  // 列表 API 不保證回傳完整 content；內文由匯入、新增與編輯送出時驗證。
  const missingFields = [
    ['title', '文章標題'],
    ['author', '作者'],
    ['description', '文章摘要'],
    ['bannerText', '卡片短文'],
  ]
    .filter(([field]) => !isNonEmptyString(article[field]))
    .map(([, label]) => label);

  if (missingFields.length > 0) {
    addIssue(issues, 'MISSING_REQUIRED', `缺少：${missingFields.join('、')}`);
  }
  if (
    isNonEmptyString(article.title) &&
    duplicateTitles.has(article.title.trim().toLowerCase())
  ) {
    addIssue(issues, 'DUPLICATE_TITLE', `標題重複：${article.title.trim()}`);
  }

  const taxonomyMessages = [];
  if (!CATEGORY_VALUES.has(article.articleCategory)) taxonomyMessages.push('文章分類');
  if (!SCOPE_VALUES.has(article.viewerScope)) taxonomyMessages.push('顯示對象');
  if (!PRIORITY_VALUES.has(String(article.priorityLevel))) taxonomyMessages.push('排序權重');
  if (!ZONE_VALUES.has(article.displayZone)) taxonomyMessages.push('顯示區域');
  if (taxonomyMessages.length > 0) {
    addIssue(issues, 'INVALID_TAXONOMY', `未定義：${taxonomyMessages.join('、')}`);
  }

  if (
    !Array.isArray(article.tag) ||
    article.tag.length > 4 ||
    article.tag.some((tag) => !TAG_VALUES.has(tag))
  ) {
    addIssue(issues, 'INVALID_TAGS', 'tag 必須是最多 4 個已定義標籤的陣列');
  } else if (article.tag.length === 0) {
    addIssue(issues, 'MISSING_TAGS', '建議至少設定一個內容標籤');
  }

  if (!isValidTimestamp(article.create_at)) {
    addIssue(issues, 'INVALID_DATE', 'create_at 必須是有效的 Unix timestamp');
  }
  const hasStart = article.publishStart !== '' && article.publishStart != null;
  const hasEnd = article.publishEnd !== '' && article.publishEnd != null;
  if ((hasStart && !isValidTimestamp(article.publishStart)) ||
      (hasEnd && !isValidTimestamp(article.publishEnd)) ||
      (hasStart && hasEnd && article.publishEnd < article.publishStart)) {
    addIssue(issues, 'INVALID_DATE', '上下架日期無效或結束日早於開始日');
  }

  if (typeof article.isPublic !== 'boolean') {
    addIssue(issues, 'INVALID_PUBLIC_STATUS', 'isPublic 必須是 boolean');
  }

  if (!article.image) {
    addIssue(issues, 'MISSING_IMAGE', '前台會使用預設圖片，建議補上正式封面');
  } else if (!isValidHttpUrl(article.image)) {
    addIssue(issues, 'INVALID_IMAGE', 'image 必須是有效的 HTTP(S) 網址');
  }

  if (article.isPublic && article.viewerScope === 'admin') {
    addIssue(issues, 'SCOPE_MISMATCH', '公開文章不可只設定為內部管理可見');
  }

  const today = getDayStart(now);
  const startDay = hasStart && isValidTimestamp(article.publishStart)
    ? getDayStart(article.publishStart * 1000)
    : null;
  const endDay = hasEnd && isValidTimestamp(article.publishEnd)
    ? getDayStart(article.publishEnd * 1000)
    : null;

  if (!article.isPublic) addIssue(issues, 'DRAFT', '文章目前不會顯示於前台');
  if (!hasStart) addIssue(issues, 'NO_PUBLISH_START', '未設定時將不限制開始日期');
  if (startDay !== null && startDay > today) {
    addIssue(issues, 'SCHEDULED', '文章已排程，但尚未到上架開始日');
  }
  if (endDay !== null && endDay < today) {
    addIssue(
      issues,
      article.isPublic ? 'EXPIRED_PUBLIC' : 'EXPIRED',
      article.isPublic ? '請取消公開或延長下架日' : '文章已結束投放',
    );
  }

  const errorCount = issues.filter(
    (issue) => issue.severity === ARTICLE_HEALTH_STATUS.ERROR,
  ).length;
  const warningCount = issues.filter(
    (issue) => issue.severity === ARTICLE_HEALTH_STATUS.WARNING,
  ).length;
  const status = errorCount
    ? ARTICLE_HEALTH_STATUS.ERROR
    : warningCount
      ? ARTICLE_HEALTH_STATUS.WARNING
      : ARTICLE_HEALTH_STATUS.HEALTHY;

  return { articleId: article.id, status, errorCount, warningCount, issues };
};

export const analyzeArticleHealth = (articles = [], now = Date.now()) => {
  const duplicateTitles = getDuplicateTitleSet(articles);
  const byArticleId = {};
  const issueGroupMap = new Map();
  const summary = {
    total: articles.length,
    healthy: 0,
    error: 0,
    warning: 0,
    published: 0,
    draft: 0,
    scheduled: 0,
    expired: 0,
  };

  articles.forEach((article, index) => {
    const result = analyzeSingleArticle(article, duplicateTitles, now);
    const key = article.id || `article-${index}`;
    byArticleId[key] = result;
    summary[result.status] += 1;
    if (article.isPublic) summary.published += 1;
    else summary.draft += 1;
    if (result.issues.some((issue) => issue.code === 'SCHEDULED')) summary.scheduled += 1;
    if (result.issues.some((issue) => ['EXPIRED', 'EXPIRED_PUBLIC'].includes(issue.code))) {
      summary.expired += 1;
    }

    result.issues.forEach((issue) => {
      const group = issueGroupMap.get(issue.code) || {
        code: issue.code,
        label: issue.label,
        severity: issue.severity,
        count: 0,
        articleIds: [],
      };
      group.count += 1;
      group.articleIds.push(article.id);
      issueGroupMap.set(issue.code, group);
    });
  });

  const issueGroups = [...issueGroupMap.values()].sort((left, right) => {
    if (left.severity !== right.severity) {
      return left.severity === ARTICLE_HEALTH_STATUS.ERROR ? -1 : 1;
    }
    return right.count - left.count;
  });

  return { summary, byArticleId, issueGroups };
};
