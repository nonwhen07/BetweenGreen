import { DEFAULT_COUPON } from '@/constants/couponConstants';

export const COUPON_ADMIN_FIELDS = {
  title: { label: '優惠券標題', required: true, type: 'string' },
  code: { label: '優惠代碼', required: true, type: 'string' },
  percent: { label: '折扣百分比', required: true, type: 'number' },
  due_date: { label: '到期日', required: true, type: 'unixTimestamp' },
  is_enabled: { label: '啟用狀態', required: true, type: 'enabled' },
};

const normalizeEnabled = (value) => {
  return value === 1 || value === true || value === '1' ? 1 : 0;
};

export const normalizeCouponAdminData = (source = {}) => {
  const title = source.title ?? DEFAULT_COUPON.title;
  const code = source.code ?? DEFAULT_COUPON.code;

  return {
    ...DEFAULT_COUPON,
    ...source,
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

    if (
      definition.required &&
      (value === undefined || value === null || value === '')
    ) {
      errors.push(`${definition.label}（${field}）為必填`);
      return;
    }

    if (definition.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} 必須是字串`);
    }

    if (definition.type === 'number' && !Number.isFinite(value)) {
      errors.push(`${field} 必須是有效數字`);
    }

    if (
      definition.type === 'unixTimestamp' &&
      (!Number.isInteger(value) || value <= 0)
    ) {
      errors.push(`${field} 必須是有效的 Unix timestamp`);
    }

    if (
      definition.type === 'enabled' &&
      value !== 0 &&
      value !== 1
    ) {
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

  return { errors, warnings };
};
