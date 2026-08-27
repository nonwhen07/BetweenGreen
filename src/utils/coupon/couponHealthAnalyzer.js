import { COUPON_EXPIRING_SOON_DAYS } from '@/constants/couponConstants';

export const COUPON_HEALTH_STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  ERROR: 'error',
};

export const COUPON_HEALTH_ISSUE_MAP = {
  MISSING_REQUIRED: {
    label: '必填資料不完整',
    severity: COUPON_HEALTH_STATUS.ERROR,
  },
  DUPLICATE_CODE: {
    label: '優惠代碼重複',
    severity: COUPON_HEALTH_STATUS.ERROR,
  },
  INVALID_PERCENT: {
    label: '折扣資料異常',
    severity: COUPON_HEALTH_STATUS.ERROR,
  },
  INVALID_DUE_DATE: {
    label: '到期日資料異常',
    severity: COUPON_HEALTH_STATUS.ERROR,
  },
  INVALID_ENABLED_STATUS: {
    label: '啟用狀態異常',
    severity: COUPON_HEALTH_STATUS.ERROR,
  },
  EXPIRED_ENABLED: {
    label: '已到期但仍啟用',
    severity: COUPON_HEALTH_STATUS.ERROR,
  },
  EXPIRED: {
    label: '優惠券已到期',
    severity: COUPON_HEALTH_STATUS.WARNING,
  },
  EXPIRING_SOON: {
    label: `將於 ${COUPON_EXPIRING_SOON_DAYS} 天內到期`,
    severity: COUPON_HEALTH_STATUS.WARNING,
  },
  DISABLED: {
    label: '優惠券未啟用',
    severity: COUPON_HEALTH_STATUS.WARNING,
  },
  NO_DISCOUNT: {
    label: '折扣為 100%',
    severity: COUPON_HEALTH_STATUS.WARNING,
  },
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const addIssue = (issues, code, message) => {
  const definition = COUPON_HEALTH_ISSUE_MAP[code];

  issues.push({
    code,
    label: definition.label,
    severity: definition.severity,
    message,
  });
};

const getStartOfLocalDay = (dateValue) => {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const getDaysUntilDue = (dueDate, now) => {
  const dueDateMilliseconds = Number(dueDate) * 1000;

  if (!Number.isInteger(Number(dueDate)) || Number(dueDate) <= 0) {
    return null;
  }

  return Math.round(
    (getStartOfLocalDay(dueDateMilliseconds) - getStartOfLocalDay(now)) /
      MILLISECONDS_PER_DAY,
  );
};

const getDuplicateCodeSet = (coupons) => {
  const counts = coupons.reduce((result, coupon) => {
    if (!isNonEmptyString(coupon.code)) return result;

    const normalizedCode = coupon.code.trim().toLowerCase();
    result.set(normalizedCode, (result.get(normalizedCode) || 0) + 1);
    return result;
  }, new Map());

  return new Set(
    [...counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([code]) => code),
  );
};

const analyzeSingleCoupon = (coupon, duplicateCodeSet, now) => {
  const issues = [];
  const missingFields = [];

  if (!isNonEmptyString(coupon.title)) missingFields.push('優惠券標題');
  if (!isNonEmptyString(coupon.code)) missingFields.push('優惠代碼');

  if (missingFields.length > 0) {
    addIssue(issues, 'MISSING_REQUIRED', `缺少：${missingFields.join('、')}`);
  }

  if (
    isNonEmptyString(coupon.code) &&
    duplicateCodeSet.has(coupon.code.trim().toLowerCase())
  ) {
    addIssue(issues, 'DUPLICATE_CODE', `優惠代碼重複：${coupon.code.trim()}`);
  }

  if (
    !Number.isFinite(coupon.percent) ||
    coupon.percent < 1 ||
    coupon.percent > 100
  ) {
    addIssue(issues, 'INVALID_PERCENT', 'percent 必須介於 1 到 100');
  } else if (coupon.percent === 100) {
    addIssue(issues, 'NO_DISCOUNT', '100% 代表不折扣，請確認優惠設定');
  }

  const daysUntilDue = getDaysUntilDue(coupon.due_date, now);

  if (daysUntilDue === null) {
    addIssue(issues, 'INVALID_DUE_DATE', 'due_date 必須是有效的 Unix timestamp');
  } else if (daysUntilDue < 0) {
    if (coupon.is_enabled === 1) {
      addIssue(issues, 'EXPIRED_ENABLED', '優惠券已到期，請停用或更新到期日');
    } else {
      addIssue(issues, 'EXPIRED', '優惠券已超過到期日');
    }
  } else if (daysUntilDue <= COUPON_EXPIRING_SOON_DAYS) {
    addIssue(
      issues,
      'EXPIRING_SOON',
      daysUntilDue === 0 ? '優惠券將於今天到期' : `優惠券將於 ${daysUntilDue} 天後到期`,
    );
  }

  if (coupon.is_enabled !== 0 && coupon.is_enabled !== 1) {
    addIssue(issues, 'INVALID_ENABLED_STATUS', 'is_enabled 必須是 0 或 1');
  } else if (coupon.is_enabled === 0) {
    addIssue(issues, 'DISABLED', '優惠券目前未啟用');
  }

  const errorCount = issues.filter(
    (issue) => issue.severity === COUPON_HEALTH_STATUS.ERROR,
  ).length;
  const warningCount = issues.filter(
    (issue) => issue.severity === COUPON_HEALTH_STATUS.WARNING,
  ).length;
  const status = errorCount
    ? COUPON_HEALTH_STATUS.ERROR
    : warningCount
      ? COUPON_HEALTH_STATUS.WARNING
      : COUPON_HEALTH_STATUS.HEALTHY;

  return {
    couponId: coupon.id,
    status,
    errorCount,
    warningCount,
    issues,
  };
};

export const analyzeCouponHealth = (coupons = [], now = Date.now()) => {
  const duplicateCodeSet = getDuplicateCodeSet(coupons);
  const byCouponId = {};
  const issueGroupMap = new Map();
  const summary = {
    total: coupons.length,
    healthy: 0,
    error: 0,
    warning: 0,
    enabled: 0,
    disabled: 0,
    expired: 0,
    expiringSoon: 0,
  };

  coupons.forEach((coupon, index) => {
    const result = analyzeSingleCoupon(coupon, duplicateCodeSet, now);
    const couponKey = coupon.id || `coupon-${index}`;
    byCouponId[couponKey] = result;
    summary[result.status] += 1;

    if (coupon.is_enabled === 1) summary.enabled += 1;
    if (coupon.is_enabled === 0) summary.disabled += 1;
    if (result.issues.some((issue) => ['EXPIRED', 'EXPIRED_ENABLED'].includes(issue.code))) {
      summary.expired += 1;
    }
    if (result.issues.some((issue) => issue.code === 'EXPIRING_SOON')) {
      summary.expiringSoon += 1;
    }

    result.issues.forEach((issue) => {
      const currentGroup = issueGroupMap.get(issue.code) || {
        code: issue.code,
        label: issue.label,
        severity: issue.severity,
        count: 0,
        couponIds: [],
      };

      currentGroup.count += 1;
      currentGroup.couponIds.push(coupon.id);
      issueGroupMap.set(issue.code, currentGroup);
    });
  });

  const issueGroups = [...issueGroupMap.values()].sort((left, right) => {
    if (left.severity !== right.severity) {
      return left.severity === COUPON_HEALTH_STATUS.ERROR ? -1 : 1;
    }

    return right.count - left.count;
  });

  return { summary, byCouponId, issueGroups };
};
