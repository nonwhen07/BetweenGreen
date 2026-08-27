import {
  ARTICLE_CATEGORY_MAP,
  ARTICLE_DISPLAY_ZONE_MAP,
  ARTICLE_MAX_TAGS,
  ARTICLE_PRIORITY_MAP,
  ARTICLE_TAG_MAP,
  ARTICLE_VIEWER_SCOPE_MAP,
  DEFAULT_ARTICLE,
} from '@/constants/articleConstants';
import { analyzeArticleHealth } from '@/utils/articleHealthAnalyzer';

export const ARTICLE_ADMIN_FIELDS = {
  title: { label: '文章標題', required: true, type: 'string' },
  author: { label: '作者', required: true, type: 'string' },
  description: { label: '文章摘要', required: true, type: 'string' },
  content: { label: '文章內容', required: true, type: 'string' },
  image: { label: '封面圖片', required: false, type: 'string' },
  tag: { label: '文章標籤', required: false, type: 'stringArray' },
  create_at: { label: '建立日期', required: true, type: 'unixTimestamp' },
  isPublic: { label: '公開狀態', required: true, type: 'boolean' },
  articleCategory: { label: '文章分類', required: true, type: 'string' },
  publishStart: { label: '上架開始', required: false, type: 'optionalUnixTimestamp' },
  publishEnd: { label: '上架結束', required: false, type: 'optionalUnixTimestamp' },
  viewerScope: { label: '顯示對象', required: true, type: 'string' },
  priorityLevel: { label: '排序權重', required: true, type: 'string' },
  bannerText: { label: '卡片短文', required: true, type: 'string' },
  displayZone: { label: '顯示區域', required: true, type: 'string' },
};

export const ARTICLE_ADMIN_FIELD_KEYS = Object.keys(ARTICLE_ADMIN_FIELDS);

const CATEGORY_VALUES = new Set(
  Object.values(ARTICLE_CATEGORY_MAP).map((item) => item.value),
);
const VIEWER_SCOPE_VALUES = new Set(
  Object.values(ARTICLE_VIEWER_SCOPE_MAP).map((item) => item.value),
);
const PRIORITY_VALUES = new Set(
  Object.values(ARTICLE_PRIORITY_MAP).map((item) => item.value),
);
const DISPLAY_ZONE_VALUES = new Set(
  Object.values(ARTICLE_DISPLAY_ZONE_MAP).map((item) => item.value),
);
const TAG_VALUES = new Set(
  Object.values(ARTICLE_TAG_MAP).map((item) => item.value),
);

const isPlainObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const normalizeBoolean = (value) => {
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  return value;
};

const normalizeOptionalTimestamp = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  return Number(value);
};

const normalizeTags = (value) => {
  if (!Array.isArray(value)) return value;

  return [...new Set(
    value.map((tag) => (typeof tag === 'string' ? tag.trim() : tag)).filter(Boolean),
  )];
};

export const normalizeArticleAdminData = (source = {}) => {
  const normalizeString = (field) => {
    const value = source[field] ?? DEFAULT_ARTICLE[field];
    return typeof value === 'string' ? value.trim() : value;
  };

  return {
    title: normalizeString('title'),
    author: normalizeString('author'),
    description: normalizeString('description'),
    content: normalizeString('content'),
    image: normalizeString('image'),
    tag: normalizeTags(source.tag ?? DEFAULT_ARTICLE.tag),
    create_at: Number(source.create_at ?? DEFAULT_ARTICLE.create_at),
    isPublic: normalizeBoolean(source.isPublic ?? DEFAULT_ARTICLE.isPublic),
    articleCategory: normalizeString('articleCategory'),
    publishStart: normalizeOptionalTimestamp(source.publishStart),
    publishEnd: normalizeOptionalTimestamp(source.publishEnd),
    viewerScope: normalizeString('viewerScope'),
    priorityLevel: String(source.priorityLevel ?? DEFAULT_ARTICLE.priorityLevel),
    bannerText: normalizeString('bannerText'),
    displayZone: normalizeString('displayZone'),
  };
};

const isValidHttpUrl = (value) => {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validateArticleAdminData = (article = {}) => {
  const errors = [];
  const warnings = [];

  Object.entries(ARTICLE_ADMIN_FIELDS).forEach(([field, definition]) => {
    const value = article[field];

    if (
      definition.required &&
      (value === undefined || value === null || value === '')
    ) {
      errors.push(`${definition.label}（${field}）為必填`);
      return;
    }

    if (value === undefined || value === null || value === '') return;

    if (definition.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} 必須是字串`);
    }

    if (
      definition.type === 'unixTimestamp' &&
      (!Number.isInteger(value) || value <= 0)
    ) {
      errors.push(`${field} 必須是有效的 Unix timestamp`);
    }

    if (
      definition.type === 'optionalUnixTimestamp' &&
      (!Number.isInteger(value) || value <= 0)
    ) {
      errors.push(`${field} 必須是有效的 Unix timestamp 或空字串`);
    }

    if (definition.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`${field} 必須是 boolean`);
    }

    if (definition.type === 'stringArray' && !Array.isArray(value)) {
      errors.push(`${field} 必須是陣列`);
    }
  });

  if (article.title?.length > 60) errors.push('title 長度不得超過 60 字');
  if (article.bannerText?.length > 100) {
    errors.push('bannerText 長度不得超過 100 字');
  }

  if (article.articleCategory && !CATEGORY_VALUES.has(article.articleCategory)) {
    errors.push(`articleCategory 未定義：${article.articleCategory}`);
  }
  if (article.viewerScope && !VIEWER_SCOPE_VALUES.has(article.viewerScope)) {
    errors.push(`viewerScope 未定義：${article.viewerScope}`);
  }
  if (article.priorityLevel && !PRIORITY_VALUES.has(article.priorityLevel)) {
    errors.push(`priorityLevel 未定義：${article.priorityLevel}`);
  }
  if (article.displayZone && !DISPLAY_ZONE_VALUES.has(article.displayZone)) {
    errors.push(`displayZone 未定義：${article.displayZone}`);
  }

  if (Array.isArray(article.tag)) {
    const unknownTags = article.tag.filter((tag) => !TAG_VALUES.has(tag));
    if (unknownTags.length > 0) {
      errors.push(`tag 包含未定義標籤：${unknownTags.join('、')}`);
    }
    if (article.tag.length > ARTICLE_MAX_TAGS) {
      errors.push(`tag 最多只能有 ${ARTICLE_MAX_TAGS} 個`);
    }
    if (article.tag.length === 0) warnings.push('文章尚未設定標籤');
  }

  if (article.image && !isValidHttpUrl(article.image)) {
    errors.push('image 必須是有效的 HTTP(S) 網址');
  }

  if (
    article.publishStart &&
    article.publishEnd &&
    article.publishEnd < article.publishStart
  ) {
    errors.push('publishEnd 不可早於 publishStart');
  }

  if (!article.image) warnings.push('文章尚未設定封面圖片');
  if (article.isPublic && article.viewerScope === 'admin') {
    warnings.push('文章已公開但顯示對象為內部管理');
  }

  return { errors, warnings };
};

const extractArticleList = (source) => {
  if (Array.isArray(source)) return source;
  if (!isPlainObject(source)) throw new Error('JSON 最外層必須是物件或陣列');
  if (Array.isArray(source.articles)) return source.articles;
  if ('data' in source) {
    throw new Error('這是單筆 API payload；批次新增請使用 articles 文章陣列');
  }
  throw new Error('批次新增請使用 { "articles": [文章資料] }');
};

const extractArticleMap = (source) => {
  if (!isPlainObject(source)) throw new Error('JSON 最外層必須是物件');
  if (Array.isArray(source.articles)) {
    throw new Error('批次更新需要文章 ID；請使用 articles ID 對應物件');
  }
  if (isPlainObject(source.articles)) return source.articles;
  if ('data' in source || 'meta' in source) {
    throw new Error('批次更新請使用 articles ID 對應物件');
  }
  return source;
};

const getUnknownFields = (article) => {
  return Object.keys(article).filter(
    (field) => field !== 'id' && !ARTICLE_ADMIN_FIELDS[field],
  );
};

const getHealthWarnings = (article) => {
  const previewId = article.id || '__article-import-preview__';
  const result = analyzeArticleHealth([{ ...article, id: previewId }]);
  return (result.byArticleId[previewId]?.issues || []).map(
    (issue) => `健康提醒：${issue.label}－${issue.message}`,
  );
};

const normalizeTitle = (value) => {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
};

const getChangedFields = (currentArticle, nextArticle) => {
  if (!currentArticle) return [];
  return ARTICLE_ADMIN_FIELD_KEYS.filter(
    (field) =>
      JSON.stringify(currentArticle[field]) !== JSON.stringify(nextArticle[field]),
  );
};

const buildSummary = (entries, mode) => {
  return entries.reduce(
    (summary, entry) => {
      summary.total += 1;
      if (!entry.isValid) summary.invalid += 1;
      else if (mode === 'create') {
        summary.valid += 1;
        summary.creatable += 1;
      } else {
        summary.valid += 1;
        summary[entry.hasChanges ? 'changed' : 'unchanged'] += 1;
      }
      return summary;
    },
    mode === 'create'
      ? { total: 0, valid: 0, invalid: 0, creatable: 0 }
      : { total: 0, valid: 0, invalid: 0, changed: 0, unchanged: 0 },
  );
};

export const parseArticleImportJson = (jsonText) => {
  if (!jsonText.trim()) throw new Error('請先貼入文章 JSON');
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`JSON 格式錯誤：${error.message}`);
  }
};

export const analyzeArticleCreateImport = (source, existingArticles = []) => {
  const list = extractArticleList(source);
  if (list.length === 0) throw new Error('JSON 中沒有可新增的文章');

  const existingTitles = new Set(
    existingArticles.map((article) => normalizeTitle(article.title)).filter(Boolean),
  );
  const importTitles = new Set();

  const entries = list.map((rawArticle, index) => {
    const rowNumber = index + 1;
    const errors = [];
    const warnings = [];
    const key = `create-${rowNumber}`;

    if (!isPlainObject(rawArticle)) {
      return {
        key, id: '', rowNumber, title: '', data: null, changedFields: [],
        errors: ['文章資料必須是物件'], warnings, isValid: false, hasChanges: true,
      };
    }

    if ('id' in rawArticle) errors.push('批次新增不可包含 id，文章 ID 由 API 產生');
    const unknownFields = getUnknownFields(rawArticle);
    if (unknownFields.length > 0) {
      errors.push(`包含未定義欄位：${unknownFields.join('、')}`);
    }

    const data = normalizeArticleAdminData(rawArticle);
    const validation = validateArticleAdminData(data);
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);

    const titleKey = normalizeTitle(data.title);
    if (titleKey && existingTitles.has(titleKey)) {
      errors.push(`文章標題已存在：${data.title}`);
    }
    if (titleKey && importTitles.has(titleKey)) {
      errors.push(`JSON 內文章標題重複：${data.title}`);
    }
    if (titleKey) importTitles.add(titleKey);

    if (errors.length === 0) warnings.push(...getHealthWarnings(data));

    return {
      key,
      id: '',
      rowNumber,
      title: data.title || '',
      data,
      changedFields: ARTICLE_ADMIN_FIELD_KEYS,
      errors,
      warnings: [...new Set(warnings)],
      isValid: errors.length === 0,
      hasChanges: true,
    };
  });

  const summary = buildSummary(entries, 'create');
  return {
    mode: 'create', entries, summary,
    canCreate: summary.invalid === 0 && summary.creatable > 0,
    canExecute: summary.invalid === 0 && summary.creatable > 0,
  };
};

export const analyzeArticleUpdateImport = (source, existingArticles = []) => {
  const articleMap = extractArticleMap(source);
  const sourceEntries = Object.entries(articleMap);
  if (sourceEntries.length === 0) throw new Error('JSON 中沒有可更新的文章');

  const existingMap = new Map(existingArticles.map((article) => [article.id, article]));
  const entries = sourceEntries.map(([id, rawArticle]) => {
    const errors = [];
    const warnings = [];

    if (!id.trim()) errors.push('文章 ID 不可為空白');
    if (!isPlainObject(rawArticle)) {
      return {
        key: `update-${id}`, id, title: '', data: null, changedFields: [],
        errors: ['文章資料必須是物件'], warnings, isValid: false, hasChanges: false,
      };
    }

    if (rawArticle.id && rawArticle.id !== id) {
      errors.push(`物件 key 與文章內部 id 不一致：${rawArticle.id}`);
    }
    const unknownFields = getUnknownFields(rawArticle);
    if (unknownFields.length > 0) {
      errors.push(`包含未定義欄位：${unknownFields.join('、')}`);
    }

    const currentArticle = existingMap.get(id);
    if (!currentArticle) errors.push(`找不到既有文章 ID：${id}`);
    const data = normalizeArticleAdminData(rawArticle);
    const validation = validateArticleAdminData(data);
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);
    if (errors.length === 0) {
      warnings.push(...getHealthWarnings({ ...data, id }));
    }
    const changedFields = getChangedFields(currentArticle, data);

    return {
      key: `update-${id}`,
      id,
      title: data.title || currentArticle?.title || '',
      data,
      changedFields,
      errors,
      warnings: [...new Set(warnings)],
      isValid: errors.length === 0,
      hasChanges: changedFields.length > 0,
    };
  });

  const proposedMap = new Map(existingMap);
  entries.forEach((entry) => {
    if (entry.data && existingMap.has(entry.id)) {
      proposedMap.set(entry.id, { ...entry.data, id: entry.id });
    }
  });
  const titleOwners = [...proposedMap.values()].reduce((result, article) => {
    const title = normalizeTitle(article.title);
    if (!title) return result;
    const owners = result.get(title) || [];
    owners.push(article.id);
    result.set(title, owners);
    return result;
  }, new Map());
  entries.forEach((entry) => {
    const title = normalizeTitle(entry.data?.title);
    if (title && (titleOwners.get(title) || []).length > 1) {
      entry.errors.push(`更新後文章標題將重複：${entry.data.title}`);
      entry.isValid = false;
    }
  });

  const summary = buildSummary(entries, 'update');
  return {
    mode: 'update', entries, summary,
    canUpdate: summary.invalid === 0 && summary.changed > 0,
    canExecute: summary.invalid === 0 && summary.changed > 0,
  };
};
