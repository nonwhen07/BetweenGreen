import {
  CATEGORY_SPECIES_MAP,
  CATEGORY_THEME_MAP,
  CATEGORY_TYPE_MAP,
  PRODUCT_DISPLAY_TAGS_MAP,
  PRODUCT_PERSONALITY_MAP,
  PRODUCT_UNIT_MAP,
  THEME_TYPE_RELATION_MAP,
  TYPE_SPECIES_RELATION_MAP,
} from '@/constants/productConstants';

export const PRODUCT_HEALTH_STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  ERROR: 'error',
};

export const PRODUCT_HEALTH_ISSUE_MAP = {
  MISSING_REQUIRED: {
    label: '必填資料不完整',
    severity: PRODUCT_HEALTH_STATUS.ERROR,
  },
  DUPLICATE_TITLE_EN: {
    label: '英文標題重複',
    severity: PRODUCT_HEALTH_STATUS.ERROR,
  },
  INVALID_CATEGORY: {
    label: '商品分類異常',
    severity: PRODUCT_HEALTH_STATUS.ERROR,
  },
  INVALID_UNIT: {
    label: '商品單位異常',
    severity: PRODUCT_HEALTH_STATUS.ERROR,
  },
  INVALID_PRICE: {
    label: '價格資料異常',
    severity: PRODUCT_HEALTH_STATUS.ERROR,
  },
  INVALID_ENABLED_STATUS: {
    label: '啟用狀態異常',
    severity: PRODUCT_HEALTH_STATUS.ERROR,
  },
  INVALID_IMAGE_DATA: {
    label: '圖片資料異常',
    severity: PRODUCT_HEALTH_STATUS.ERROR,
  },
  INVALID_PERSONALITY_TAGS: {
    label: '商品標籤異常',
    severity: PRODUCT_HEALTH_STATUS.ERROR,
  },
  INCOMPLETE_IMAGE_SET: {
    label: '副圖數量不完整',
    severity: PRODUCT_HEALTH_STATUS.WARNING,
  },
  IMAGE_ROLE_MISMATCH: {
    label: '圖片檔名不符合規格',
    severity: PRODUCT_HEALTH_STATUS.WARNING,
  },
  PRICE_REVIEW: {
    label: '售價高於原價',
    severity: PRODUCT_HEALTH_STATUS.WARNING,
  },
  INVALID_RATING: {
    label: '評價範圍異常',
    severity: PRODUCT_HEALTH_STATUS.WARNING,
  },
  INVALID_DISPLAY_TAGS: {
    label: '展示標籤未定義',
    severity: PRODUCT_HEALTH_STATUS.WARNING,
  },
};

const REQUIRED_STRING_FIELDS = [
  ['title', '中文標題'],
  ['titleEn', '英文標題'],
  ['category', '商品分類'],
  ['content', '商品內容'],
  ['description', '商品描述'],
  ['unit', '商品單位'],
];

const DEFAULT_IMAGE_ROLES = [
  '02-isolated.png',
  '03-detail.png',
  '04-lifestyle.png',
];

const THEME_IMAGE_ROLE_MAP = {
  CelebrationGift: [
    '02-style-variation.png',
    '03-design-variation.png',
    '04-occasion-scene.png',
  ],
  SeasonGift: [
    '02-set-contents.png',
    '03-story-detail.png',
    '04-season-scene.png',
  ],
};

const PRODUCT_UNIT_VALUES = new Set(
  Object.values(PRODUCT_UNIT_MAP).map((item) => item.value),
);

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const splitTagCodes = (value = '') => {
  if (!isNonEmptyString(value)) return [];

  return value
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
};

const getImageFilename = (imageUrl) => {
  if (!isNonEmptyString(imageUrl)) return '';

  try {
    const url = new URL(imageUrl);
    return url.pathname.split('/').filter(Boolean).pop() || '';
  } catch {
    return '';
  }
};

const isHttpImageUrl = (imageUrl) => {
  if (!isNonEmptyString(imageUrl)) return false;

  try {
    const url = new URL(imageUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const addIssue = (issues, code, message) => {
  const definition = PRODUCT_HEALTH_ISSUE_MAP[code];

  issues.push({
    code,
    label: definition.label,
    severity: definition.severity,
    message,
  });
};

const validateCategory = (product, issues) => {
  if (!isNonEmptyString(product.category)) return;

  const [theme, type, species, ...extraParts] = product.category.split('-');
  const messages = [];

  if (!theme || !type || !species || extraParts.length > 0) {
    messages.push('必須符合 Theme-Type-Species 三段格式');
  } else {
    if (!CATEGORY_THEME_MAP[theme] || theme === 'AllProducts') {
      messages.push(`Theme 不存在：${theme}`);
    }

    if (!CATEGORY_TYPE_MAP[type]) {
      messages.push(`Type 不存在：${type}`);
    }

    if (!CATEGORY_SPECIES_MAP[species]) {
      messages.push(`Species 不存在：${species}`);
    }

    if (!THEME_TYPE_RELATION_MAP[theme]?.includes(type)) {
      messages.push(`Theme／Type 組合不允許：${theme}-${type}`);
    }

    if (!TYPE_SPECIES_RELATION_MAP[type]?.includes(species)) {
      messages.push(`Type／Species 組合不允許：${type}-${species}`);
    }
  }

  if (messages.length > 0) {
    addIssue(issues, 'INVALID_CATEGORY', messages.join('；'));
  }
};

const validatePrices = (product, issues) => {
  const hasValidOriginPrice = Number.isFinite(product.origin_price);
  const hasValidPrice = Number.isFinite(product.price);

  if (
    !hasValidOriginPrice ||
    !hasValidPrice ||
    product.origin_price < 0 ||
    product.price < 0
  ) {
    addIssue(issues, 'INVALID_PRICE', '原價與售價必須是大於或等於 0 的有效數字');
    return;
  }

  if (product.price > product.origin_price) {
    addIssue(issues, 'PRICE_REVIEW', '售價高於原價，請確認價格設定');
  }
};

const validateTags = (product, issues) => {
  const personalityTags = splitTagCodes(product.personalityTags);
  const unknownPersonalityTags = personalityTags.filter(
    (tag) => !PRODUCT_PERSONALITY_MAP[tag],
  );

  if (unknownPersonalityTags.length > 0 || personalityTags.length > 4) {
    const messages = [];

    if (unknownPersonalityTags.length > 0) {
      messages.push(`未定義：${unknownPersonalityTags.join('、')}`);
    }

    if (personalityTags.length > 4) {
      messages.push('最多只能有 4 個標籤');
    }

    addIssue(issues, 'INVALID_PERSONALITY_TAGS', messages.join('；'));
  }

  const displayTags = splitTagCodes(product.displayTags);
  const unknownDisplayTags = displayTags.filter(
    (tag) => !PRODUCT_DISPLAY_TAGS_MAP[tag],
  );

  if (unknownDisplayTags.length > 0) {
    addIssue(
      issues,
      'INVALID_DISPLAY_TAGS',
      `未定義：${unknownDisplayTags.join('、')}`,
    );
  }
};

const validateImages = (product, issues) => {
  const mainImageIsValid = isHttpImageUrl(product.imageUrl);
  const subImagesAreArray = Array.isArray(product.imagesUrl);
  const subImagesAreValid =
    subImagesAreArray &&
    product.imagesUrl.every((imageUrl) => isHttpImageUrl(imageUrl));

  if (!mainImageIsValid || !subImagesAreArray || !subImagesAreValid) {
    addIssue(
      issues,
      'INVALID_IMAGE_DATA',
      '主圖與副圖都必須是非空白的 HTTP(S) 網址',
    );
  }

  if (!subImagesAreArray || product.imagesUrl.length !== 3) {
    addIssue(
      issues,
      'INCOMPLETE_IMAGE_SET',
      `副圖應為 3 張，目前為 ${subImagesAreArray ? product.imagesUrl.length : 0} 張`,
    );
  }

  if (!mainImageIsValid || !subImagesAreValid) return;

  const theme = product.category?.split('-')[0];
  const expectedSubImages =
    THEME_IMAGE_ROLE_MAP[theme] || DEFAULT_IMAGE_ROLES;
  const actualMainImage = getImageFilename(product.imageUrl);
  const actualSubImages = product.imagesUrl.map(getImageFilename);
  const roleMessages = [];

  if (actualMainImage !== '01-hero.png') {
    roleMessages.push(`主圖應為 01-hero.png，目前為 ${actualMainImage}`);
  }

  if (
    actualSubImages.length === expectedSubImages.length &&
    actualSubImages.some(
      (filename, index) => filename !== expectedSubImages[index],
    )
  ) {
    roleMessages.push(
      `副圖應依序為 ${expectedSubImages.join('、')}`,
    );
  }

  if (roleMessages.length > 0) {
    addIssue(issues, 'IMAGE_ROLE_MISMATCH', roleMessages.join('；'));
  }
};

const getDuplicateTitleEnSet = (products) => {
  const counts = products.reduce((result, product) => {
    if (!isNonEmptyString(product.titleEn)) return result;

    const normalizedTitle = product.titleEn.trim().toLowerCase();
    result.set(normalizedTitle, (result.get(normalizedTitle) || 0) + 1);
    return result;
  }, new Map());

  return new Set(
    [...counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([titleEn]) => titleEn),
  );
};

const analyzeSingleProduct = (product, duplicateTitleEnSet) => {
  const issues = [];
  const missingFields = REQUIRED_STRING_FIELDS.filter(
    ([field]) => !isNonEmptyString(product[field]),
  ).map(([, label]) => label);

  if (missingFields.length > 0) {
    addIssue(
      issues,
      'MISSING_REQUIRED',
      `缺少：${missingFields.join('、')}`,
    );
  }

  if (
    isNonEmptyString(product.titleEn) &&
    duplicateTitleEnSet.has(product.titleEn.trim().toLowerCase())
  ) {
    addIssue(
      issues,
      'DUPLICATE_TITLE_EN',
      `titleEn 重複：${product.titleEn.trim()}`,
    );
  }

  validateCategory(product, issues);

  if (isNonEmptyString(product.unit) && !PRODUCT_UNIT_VALUES.has(product.unit)) {
    addIssue(issues, 'INVALID_UNIT', `unit 不在 PRODUCT_UNIT_MAP：${product.unit}`);
  }

  validatePrices(product, issues);

  if (product.is_enabled !== 0 && product.is_enabled !== 1) {
    addIssue(issues, 'INVALID_ENABLED_STATUS', 'is_enabled 必須是 0 或 1');
  }

  validateImages(product, issues);
  validateTags(product, issues);

  if (
    product.rating !== undefined &&
    (!Number.isFinite(product.rating) || product.rating < 0 || product.rating > 5)
  ) {
    addIssue(issues, 'INVALID_RATING', 'rating 必須介於 0 到 5');
  }

  const errorCount = issues.filter(
    (issue) => issue.severity === PRODUCT_HEALTH_STATUS.ERROR,
  ).length;
  const warningCount = issues.filter(
    (issue) => issue.severity === PRODUCT_HEALTH_STATUS.WARNING,
  ).length;

  const status = errorCount
    ? PRODUCT_HEALTH_STATUS.ERROR
    : warningCount
      ? PRODUCT_HEALTH_STATUS.WARNING
      : PRODUCT_HEALTH_STATUS.HEALTHY;

  return {
    productId: product.id,
    status,
    errorCount,
    warningCount,
    issues,
  };
};

export const analyzeProductHealth = (products = []) => {
  const duplicateTitleEnSet = getDuplicateTitleEnSet(products);
  const byProductId = {};
  const issueGroupMap = new Map();

  const summary = {
    total: products.length,
    healthy: 0,
    error: 0,
    warning: 0,
    disabled: 0,
  };

  products.forEach((product, index) => {
    const result = analyzeSingleProduct(product, duplicateTitleEnSet);
    const productKey = product.id || `product-${index}`;
    byProductId[productKey] = result;
    summary[result.status] += 1;

    if (!product.is_enabled) {
      summary.disabled += 1;
    }

    result.issues.forEach((issue) => {
      const currentGroup = issueGroupMap.get(issue.code) || {
        code: issue.code,
        label: issue.label,
        severity: issue.severity,
        count: 0,
        productIds: [],
      };

      currentGroup.count += 1;
      currentGroup.productIds.push(product.id);
      issueGroupMap.set(issue.code, currentGroup);
    });
  });

  const issueGroups = [...issueGroupMap.values()].sort((left, right) => {
    if (left.severity !== right.severity) {
      return left.severity === PRODUCT_HEALTH_STATUS.ERROR ? -1 : 1;
    }

    return right.count - left.count;
  });

  return {
    summary,
    byProductId,
    issueGroups,
  };
};
