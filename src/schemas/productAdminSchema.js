import {
  CATEGORY_SPECIES_MAP,
  CATEGORY_THEME_MAP,
  CATEGORY_TYPE_MAP,
  DEFAULT_PRODUCT,
  PRODUCT_DISPLAY_TAGS_MAP,
  PRODUCT_PERSONALITY_MAP,
  PRODUCT_UNIT_MAP,
  THEME_TYPE_RELATION_MAP,
  TYPE_SPECIES_RELATION_MAP,
} from '@/constants/productConstants';

export const PRODUCT_ADMIN_FIELDS = {
  title: { label: '中文標題', required: true, type: 'string' },
  titleEn: { label: '英文標題', required: true, type: 'string' },
  category: { label: '商品分類', required: true, type: 'string' },
  content: { label: '商品內容', required: true, type: 'string' },
  description: { label: '商品描述', required: true, type: 'string' },
  unit: { label: '商品單位', required: true, type: 'string' },
  origin_price: { label: '原價', required: true, type: 'number' },
  price: { label: '售價', required: true, type: 'number' },
  is_enabled: { label: '啟用狀態', required: true, type: 'enabled' },
  imageUrl: { label: '主圖', required: true, type: 'string' },
  imagesUrl: { label: '副圖', required: true, type: 'stringArray' },
  rating: { label: '評價', required: false, type: 'number', defaultValue: 0 },
  personalityTags: {
    label: '商品人格標籤',
    required: false,
    type: 'string',
    defaultValue: '',
  },
  displayTags: {
    label: '商業展示標籤',
    required: false,
    type: 'string',
    defaultValue: '',
  },
  num: {
    label: 'API 舊排序欄位',
    required: false,
    type: 'number',
    preserveExisting: true,
  },
};

export const PRODUCT_IMPORT_PREVIEW_FIELDS = [
  'title',
  'titleEn',
  'category',
  'price',
  'is_enabled',
  'imageUrl',
  'imagesUrl',
];

const PRODUCT_ADMIN_FIELD_KEYS = Object.keys(PRODUCT_ADMIN_FIELDS);
const PRODUCT_UNIT_VALUES = new Set(
  Object.values(PRODUCT_UNIT_MAP).map((item) => item.value),
);

const isPlainObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const splitTagCodes = (value = '') => {
  return value
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
};

const coerceEnabled = (value) => {
  if (value === 1 || value === true || value === '1') return 1;
  if (value === 0 || value === false || value === '0') return 0;
  return value;
};

const coerceFieldValue = (value, field) => {
  const definition = PRODUCT_ADMIN_FIELDS[field];

  if (
    definition.type === 'number' &&
    value !== '' &&
    value !== null &&
    value !== undefined
  ) {
    return Number(value);
  }

  if (definition.type === 'enabled') {
    return coerceEnabled(value);
  }

  if (definition.type === 'string' && typeof value === 'string') {
    return value.trim();
  }

  if (definition.type === 'stringArray' && Array.isArray(value)) {
    return value.map((item) => (typeof item === 'string' ? item.trim() : item));
  }

  return value;
};

const validateCategory = (category, errors) => {
  const [theme, type, species, ...extraParts] = category.split('-');

  if (!theme || !type || !species || extraParts.length > 0) {
    errors.push('category 必須符合 Theme-Type-Species 三段格式');
    return;
  }

  if (!CATEGORY_THEME_MAP[theme] || theme === 'AllProducts') {
    errors.push(`category theme 不存在：${theme || '空白'}`);
  }

  if (!CATEGORY_TYPE_MAP[type]) {
    errors.push(`category type 不存在：${type || '空白'}`);
  }

  if (!CATEGORY_SPECIES_MAP[species]) {
    errors.push(`category species 不存在：${species || '空白'}`);
  }

  if (theme && type && !THEME_TYPE_RELATION_MAP[theme]?.includes(type)) {
    errors.push(`category theme/type 組合不允許：${theme}-${type}`);
  }

  if (type && species && !TYPE_SPECIES_RELATION_MAP[type]?.includes(species)) {
    errors.push(`category type/species 組合不允許：${type}-${species}`);
  }
};

const validateTags = (field, value, allowedMap, messages, maxCount = null) => {
  if (!value) return;

  const tags = splitTagCodes(value);
  const unknownTags = tags.filter((tag) => !allowedMap[tag]);

  if (unknownTags.length > 0) {
    messages.push(`${field} 包含未定義標籤：${unknownTags.join('、')}`);
  }

  if (maxCount && tags.length > maxCount) {
    messages.push(`${field} 最多只能有 ${maxCount} 個標籤`);
  }
};

const validateProduct = (product) => {
  const errors = [];
  const warnings = [];

  Object.entries(PRODUCT_ADMIN_FIELDS).forEach(([field, definition]) => {
    const value = product[field];

    if (
      definition.required &&
      (value === undefined || value === null || value === '')
    ) {
      errors.push(`${definition.label}（${field}）為必填`);
      return;
    }

    if (value === undefined || value === null) return;

    if (definition.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} 必須是字串`);
    }

    if (definition.type === 'number' && !Number.isFinite(value)) {
      errors.push(`${field} 必須是有效數字`);
    }

    if (definition.type === 'enabled' && value !== 0 && value !== 1) {
      errors.push('is_enabled 必須是 0 或 1');
    }

    if (definition.type === 'stringArray') {
      if (!Array.isArray(value) || value.length === 0) {
        errors.push(`${field} 必須是至少包含一筆資料的陣列`);
      } else if (
        value.some((item) => typeof item !== 'string' || item.length === 0)
      ) {
        errors.push(`${field} 每一項都必須是非空白字串`);
      }
    }
  });

  if (typeof product.category === 'string' && product.category) {
    validateCategory(product.category, errors);
  }

  if (
    typeof product.unit === 'string' &&
    product.unit &&
    !PRODUCT_UNIT_VALUES.has(product.unit)
  ) {
    errors.push(`unit 不在 PRODUCT_UNIT_MAP 中：${product.unit}`);
  }

  validateTags(
    'personalityTags',
    product.personalityTags,
    PRODUCT_PERSONALITY_MAP,
    errors,
    4,
  );
  // displayTags 尚可能包含後台既有商業標記；第一版先提示，不阻擋既有資料更新。
  validateTags(
    'displayTags',
    product.displayTags,
    PRODUCT_DISPLAY_TAGS_MAP,
    warnings,
  );

  if (Number.isFinite(product.origin_price) && product.origin_price < 0) {
    errors.push('origin_price 不可小於 0');
  }

  if (Number.isFinite(product.price) && product.price < 0) {
    errors.push('price 不可小於 0');
  }

  if (
    Number.isFinite(product.rating) &&
    (product.rating < 0 || product.rating > 5)
  ) {
    errors.push('rating 必須介於 0 到 5');
  }

  if (
    Number.isFinite(product.origin_price) &&
    Number.isFinite(product.price) &&
    product.price > product.origin_price
  ) {
    warnings.push('售價高於原價，請確認價格設定');
  }

  return { errors, warnings };
};

const normalizeProduct = (rawProduct, currentProduct = null) => {
  return PRODUCT_ADMIN_FIELD_KEYS.reduce((normalized, field) => {
    const definition = PRODUCT_ADMIN_FIELDS[field];
    const rawValue = rawProduct[field];
    const fallbackValue = definition.defaultValue ?? DEFAULT_PRODUCT[field];

    if (
      rawValue === undefined &&
      definition.preserveExisting &&
      currentProduct?.[field] !== undefined
    ) {
      normalized[field] = currentProduct[field];
      return normalized;
    }

    if (rawValue === undefined && !definition.required) {
      if (fallbackValue === undefined) return normalized;

      normalized[field] = fallbackValue;
      return normalized;
    }

    normalized[field] = coerceFieldValue(rawValue, field);
    return normalized;
  }, {});
};

const extractProductMap = (source) => {
  if (!isPlainObject(source)) {
    throw new Error('JSON 最外層必須是物件');
  }

  if (isPlainObject(source.products)) {
    return source.products;
  }

  if ('data' in source) {
    throw new Error(
      '這是單筆 API payload 格式；批次匯入請使用 products 或 ID 對應物件',
    );
  }

  return source;
};

const isSameValue = (left, right) => {
  return JSON.stringify(left) === JSON.stringify(right);
};

export const parseProductImportJson = (jsonText) => {
  if (!jsonText.trim()) {
    throw new Error('請先貼入商品 JSON');
  }

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`JSON 格式錯誤：${error.message}`);
  }
};

export const analyzeProductUpdateImport = (source, existingProducts = []) => {
  const productMap = extractProductMap(source);
  const sourceEntries = Object.entries(productMap);

  if (sourceEntries.length === 0) {
    throw new Error('JSON 中沒有可更新的商品');
  }

  const existingProductMap = new Map(
    existingProducts.map((product) => [product.id, product]),
  );

  const entries = sourceEntries.map(([id, rawProduct]) => {
    const errors = [];
    const warnings = [];

    if (!id.trim()) {
      errors.push('商品 ID 不可為空白');
    }

    if (!isPlainObject(rawProduct)) {
      return {
        id,
        title: '',
        data: null,
        changedFields: [],
        errors: ['商品資料必須是物件'],
        warnings,
        isValid: false,
        hasChanges: false,
      };
    }

    if (rawProduct.id && rawProduct.id !== id) {
      errors.push(`物件 key 與商品內部 id 不一致：${rawProduct.id}`);
    }

    const unknownFields = Object.keys(rawProduct).filter(
      (field) => field !== 'id' && !PRODUCT_ADMIN_FIELDS[field],
    );

    if (unknownFields.length > 0) {
      errors.push(`包含未定義欄位：${unknownFields.join('、')}`);
    }

    const currentProduct = existingProductMap.get(id);
    if (!currentProduct) {
      errors.push(`找不到既有商品 ID：${id}`);
    }

    const normalizedProduct = normalizeProduct(rawProduct, currentProduct);
    const validation = validateProduct(normalizedProduct);
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);

    const changedFields = currentProduct
      ? PRODUCT_ADMIN_FIELD_KEYS.filter(
          (field) =>
            !isSameValue(currentProduct[field], normalizedProduct[field]),
        )
      : [];

    return {
      id,
      title: normalizedProduct.title || currentProduct?.title || '',
      data: normalizedProduct,
      changedFields,
      errors,
      warnings,
      isValid: errors.length === 0,
      hasChanges: changedFields.length > 0,
    };
  });

  const summary = entries.reduce(
    (result, entry) => {
      result.total += 1;

      if (entry.isValid) {
        result.valid += 1;
        result[entry.hasChanges ? 'changed' : 'unchanged'] += 1;
      } else {
        result.invalid += 1;
      }

      return result;
    },
    { total: 0, valid: 0, invalid: 0, changed: 0, unchanged: 0 },
  );

  return {
    entries,
    summary,
    canUpdate: summary.invalid === 0 && summary.changed > 0,
  };
};
