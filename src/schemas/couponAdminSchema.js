import { DEFAULT_COUPON } from '@/constants/couponConstants';
import { analyzeCouponHealth } from '@/utils/coupon/couponHealthAnalyzer';

export const COUPON_ADMIN_FIELDS = {
  title: { label: '優惠券標題', required: true, type: 'string' },
  code: { label: '優惠代碼', required: true, type: 'string' },
  percent: { label: '折扣百分比', required: true, type: 'number' },
  due_date: { label: '到期日', required: true, type: 'unixTimestamp' },
  is_enabled: { label: '啟用狀態', required: true, type: 'enabled' },
};

export const COUPON_ADMIN_FIELD_KEYS = Object.keys(COUPON_ADMIN_FIELDS);

const isPlainObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

const normalizeEnabled = (value) => {
  if (value === 1 || value === true || value === '1') return 1;
  if (value === 0 || value === false || value === '0') return 0;
  return value;
};

export const normalizeCouponAdminData = (source = {}) => {
  const title = source.title ?? DEFAULT_COUPON.title;
  const code = source.code ?? DEFAULT_COUPON.code;

  return {
    title: typeof title === 'string' ? title.trim() : title,
    code: typeof code === 'string' ? code.trim() : code,
    percent: Number(source.percent),
    due_date: Number(source.due_date),
    is_enabled: normalizeEnabled(source.is_enabled),
  };
};

export const validateCouponAdminData = (coupon = {}) => {
  const errors = [];
  const warnings = [];

  Object.entries(COUPON_ADMIN_FIELDS).forEach(([field, definition]) => {
    const value = coupon[field];

    if (definition.required && (value === undefined || value === null || value === '')) {
      errors.push(`${definition.label}（${field}）為必填`);
      return;
    }

    if (definition.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} 必須是字串`);
    }

    if (definition.type === 'number' && !Number.isFinite(value)) {
      errors.push(`${field} 必須是有效數字`);
    }

    if (definition.type === 'unixTimestamp' && (!Number.isInteger(value) || value <= 0)) {
      errors.push(`${field} 必須是有效的 Unix timestamp`);
    }

    if (definition.type === 'enabled' && value !== 0 && value !== 1) {
      errors.push('is_enabled 必須是 0 或 1');
    }
  });

  if (Number.isFinite(coupon.percent)) {
    if (coupon.percent < 1 || coupon.percent > 100) {
      errors.push('percent 必須介於 1 到 100');
    }

    if (coupon.percent === 100) {
      warnings.push('折扣為 100%，代表不折扣，請確認設定');
    }
  }

  if (typeof coupon.title === 'string' && coupon.title.length > 10) {
    errors.push('title 長度不得超過 10 碼');
  }

  if (typeof coupon.code === 'string') {
    if (coupon.code.length < 4) errors.push('code 長度不得低於 4 碼');
    if (coupon.code.length > 10) errors.push('code 長度不得超過 10 碼');
  }

  return { errors, warnings };
};

const extractCouponMap = (source) => {
  if (!isPlainObject(source)) {
    throw new Error('JSON 最外層必須是物件');
  }

  if (Array.isArray(source.coupons)) {
    throw new Error('批次更新需要優惠券 ID；請使用 coupons ID 對應物件');
  }

  if (isPlainObject(source.coupons)) return source.coupons;

  if ('data' in source || 'meta' in source) {
    throw new Error('批次更新請使用 { "coupons": { "優惠券 ID": { ...資料 } } }');
  }

  return source;
};

const extractCouponList = (source) => {
  if (Array.isArray(source)) return source;

  if (!isPlainObject(source)) {
    throw new Error('JSON 最外層必須是物件或陣列');
  }

  if (Array.isArray(source.coupons)) return source.coupons;

  if ('data' in source) {
    throw new Error('這是單筆 API payload 格式；批次新增請使用 coupons 優惠券陣列');
  }

  throw new Error('批次新增不使用優惠券 ID；請使用 { "coupons": [優惠券資料] }');
};

const getUnknownFields = (coupon) => {
  return Object.keys(coupon).filter((field) => field !== 'id' && !COUPON_ADMIN_FIELDS[field]);
};

const getHealthWarnings = (coupon) => {
  const previewId = coupon.id || '__coupon-import-preview__';
  const result = analyzeCouponHealth([{ ...coupon, id: previewId }]);

  return (result.byCouponId[previewId]?.issues || [])
    .filter((issue) => issue.code !== 'NO_DISCOUNT')
    .map((issue) => `健康提醒：${issue.label}－${issue.message}`);
};

const normalizeCode = (value) => {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
};

const getChangedFields = (currentCoupon, nextCoupon) => {
  if (!currentCoupon) return [];

  return COUPON_ADMIN_FIELD_KEYS.filter(
    (field) => JSON.stringify(currentCoupon[field]) !== JSON.stringify(nextCoupon[field]),
  );
};

const buildImportSummary = (entries, mode) => {
  return entries.reduce(
    (summary, entry) => {
      summary.total += 1;

      if (!entry.isValid) {
        summary.invalid += 1;
      } else if (mode === 'create') {
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

export const parseCouponImportJson = (jsonText) => {
  if (!jsonText.trim()) throw new Error('請先貼入優惠券 JSON');

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`JSON 格式錯誤：${error.message}`);
  }
};

export const analyzeCouponCreateImport = (source, existingCoupons = []) => {
  const couponList = extractCouponList(source);

  if (couponList.length === 0) {
    throw new Error('JSON 中沒有可新增的優惠券');
  }

  const existingCodes = new Set(
    existingCoupons.map((coupon) => normalizeCode(coupon.code)).filter(Boolean),
  );
  const importCodes = new Set();

  const entries = couponList.map((rawCoupon, index) => {
    const rowNumber = index + 1;
    const key = `create-${rowNumber}`;
    const errors = [];
    const warnings = [];

    if (!isPlainObject(rawCoupon)) {
      return {
        key,
        id: '',
        rowNumber,
        title: '',
        data: null,
        changedFields: [],
        errors: ['優惠券資料必須是物件'],
        warnings,
        isValid: false,
        hasChanges: true,
      };
    }

    if ('id' in rawCoupon) {
      errors.push('批次新增不可包含 id，優惠券 ID 由 API 自動產生');
    }

    const unknownFields = getUnknownFields(rawCoupon);
    if (unknownFields.length > 0) {
      errors.push(`包含未定義欄位：${unknownFields.join('、')}`);
    }

    const normalizedCoupon = normalizeCouponAdminData(rawCoupon);
    const validation = validateCouponAdminData(normalizedCoupon);
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);

    const normalizedCouponCode = normalizeCode(normalizedCoupon.code);
    if (normalizedCouponCode && existingCodes.has(normalizedCouponCode)) {
      errors.push(`優惠代碼已存在：${normalizedCoupon.code}`);
    }
    if (normalizedCouponCode && importCodes.has(normalizedCouponCode)) {
      errors.push(`JSON 內優惠代碼重複：${normalizedCoupon.code}`);
    }
    if (normalizedCouponCode) importCodes.add(normalizedCouponCode);

    if (errors.length === 0) {
      warnings.push(...getHealthWarnings(normalizedCoupon));
    }

    return {
      key,
      id: '',
      rowNumber,
      title: normalizedCoupon.title || '',
      data: normalizedCoupon,
      changedFields: COUPON_ADMIN_FIELD_KEYS,
      errors,
      warnings: [...new Set(warnings)],
      isValid: errors.length === 0,
      hasChanges: true,
    };
  });

  const summary = buildImportSummary(entries, 'create');

  return {
    mode: 'create',
    entries,
    summary,
    canCreate: summary.invalid === 0 && summary.creatable > 0,
    canExecute: summary.invalid === 0 && summary.creatable > 0,
  };
};

export const analyzeCouponUpdateImport = (source, existingCoupons = []) => {
  const couponMap = extractCouponMap(source);
  const sourceEntries = Object.entries(couponMap);

  if (sourceEntries.length === 0) {
    throw new Error('JSON 中沒有可更新的優惠券');
  }

  const existingCouponMap = new Map(existingCoupons.map((coupon) => [coupon.id, coupon]));

  const entries = sourceEntries.map(([id, rawCoupon]) => {
    const errors = [];
    const warnings = [];

    if (!id.trim()) errors.push('優惠券 ID 不可為空白');

    if (!isPlainObject(rawCoupon)) {
      return {
        key: `update-${id}`,
        id,
        title: '',
        data: null,
        changedFields: [],
        errors: ['優惠券資料必須是物件'],
        warnings,
        isValid: false,
        hasChanges: false,
      };
    }

    if (rawCoupon.id && rawCoupon.id !== id) {
      errors.push(`物件 key 與優惠券內部 id 不一致：${rawCoupon.id}`);
    }

    const unknownFields = getUnknownFields(rawCoupon);
    if (unknownFields.length > 0) {
      errors.push(`包含未定義欄位：${unknownFields.join('、')}`);
    }

    const currentCoupon = existingCouponMap.get(id);
    if (!currentCoupon) errors.push(`找不到既有優惠券 ID：${id}`);

    const normalizedCoupon = normalizeCouponAdminData(rawCoupon);
    const validation = validateCouponAdminData(normalizedCoupon);
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);

    if (errors.length === 0) {
      warnings.push(...getHealthWarnings({ ...normalizedCoupon, id }));
    }

    const changedFields = getChangedFields(currentCoupon, normalizedCoupon);

    return {
      key: `update-${id}`,
      id,
      title: normalizedCoupon.title || currentCoupon?.title || '',
      data: normalizedCoupon,
      changedFields,
      errors,
      warnings: [...new Set(warnings)],
      isValid: errors.length === 0,
      hasChanges: changedFields.length > 0,
    };
  });

  const proposedCouponMap = new Map(existingCouponMap);
  entries.forEach((entry) => {
    if (entry.data && existingCouponMap.has(entry.id)) {
      proposedCouponMap.set(entry.id, { ...entry.data, id: entry.id });
    }
  });

  const codeOwnerMap = [...proposedCouponMap.values()].reduce((result, coupon) => {
    const code = normalizeCode(coupon.code);
    if (!code) return result;

    const owners = result.get(code) || [];
    owners.push(coupon.id);
    result.set(code, owners);
    return result;
  }, new Map());

  entries.forEach((entry) => {
    const code = normalizeCode(entry.data?.code);
    const owners = codeOwnerMap.get(code) || [];

    if (code && owners.length > 1) {
      entry.errors.push(`更新後優惠代碼將重複：${entry.data.code}`);
      entry.isValid = false;
    }
  });

  const summary = buildImportSummary(entries, 'update');

  return {
    mode: 'update',
    entries,
    summary,
    canUpdate: summary.invalid === 0 && summary.changed > 0,
    canExecute: summary.invalid === 0 && summary.changed > 0,
  };
};
