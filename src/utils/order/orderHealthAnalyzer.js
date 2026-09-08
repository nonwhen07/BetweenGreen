import { normalizeOrderItems } from '@/utils/order/orderItemUtils';
import { getOrderUnpaidAge } from '@/utils/order/orderAnalytics';

export const ORDER_HEALTH_STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  ERROR: 'error',
};

export const ORDER_HEALTH_ISSUE_MAP = {
  MISSING_ID: {
    label: '訂單編號缺失',
    severity: ORDER_HEALTH_STATUS.ERROR,
  },
  INVALID_CUSTOMER: {
    label: '顧客資料不完整',
    severity: ORDER_HEALTH_STATUS.ERROR,
  },
  INVALID_ITEMS: {
    label: '商品明細異常',
    severity: ORDER_HEALTH_STATUS.ERROR,
  },
  INVALID_TOTAL: {
    label: '訂單金額異常',
    severity: ORDER_HEALTH_STATUS.ERROR,
  },
  INVALID_DATE: {
    label: '建立日期異常',
    severity: ORDER_HEALTH_STATUS.ERROR,
  },
  INVALID_PAID_STATUS: {
    label: '付款狀態異常',
    severity: ORDER_HEALTH_STATUS.ERROR,
  },
  UNPAID_REVIEW: {
    label: '未付款訂單建議確認',
    severity: ORDER_HEALTH_STATUS.WARNING,
  },
  UNPAID_OVERDUE: {
    label: '未付款訂單已達 7 天',
    severity: ORDER_HEALTH_STATUS.WARNING,
  },
};

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const addIssue = (issues, code, message) => {
  const definition = ORDER_HEALTH_ISSUE_MAP[code];

  issues.push({
    code,
    label: definition.label,
    severity: definition.severity,
    message,
  });
};

const getCustomerMissingFields = (user) => {
  if (!user || typeof user !== 'object' || Array.isArray(user)) {
    return ['姓名', 'Email', '電話', '地址'];
  }

  return [
    ['name', '姓名'],
    ['email', 'Email'],
    ['tel', '電話'],
    ['address', '地址'],
  ]
    .filter(([field]) => !isNonEmptyString(user[field]))
    .map(([, label]) => label);
};

const getItemIssues = (products) => {
  const items = normalizeOrderItems(products);
  const messages = [];

  if (items.length === 0) {
    return ['沒有商品明細'];
  }

  items.forEach((item, index) => {
    const itemLabel = item.title || `第 ${index + 1} 筆商品`;

    if (!isNonEmptyString(item.title)) {
      messages.push(`${itemLabel}缺少商品名稱`);
    }
    if (!Number.isFinite(item.qty) || item.qty <= 0) {
      messages.push(`${itemLabel}的數量必須大於 0`);
    }
    if (!Number.isFinite(item.price) || item.price < 0) {
      messages.push(`${itemLabel}的單價不可小於 0`);
    }
    if (!Number.isFinite(item.total) || item.total < 0) {
      messages.push(`${itemLabel}的小計不可小於 0`);
    }
  });

  return messages;
};

const analyzeSingleOrder = (order, index, now) => {
  const issues = [];

  if (!isNonEmptyString(order.id)) {
    addIssue(issues, 'MISSING_ID', '訂單必須有可追蹤的 ID');
  }

  const customerMissingFields = getCustomerMissingFields(order.user);
  if (customerMissingFields.length > 0) {
    addIssue(issues, 'INVALID_CUSTOMER', `缺少：${customerMissingFields.join('、')}`);
  }

  const itemIssues = getItemIssues(order.products);
  if (itemIssues.length > 0) {
    addIssue(issues, 'INVALID_ITEMS', itemIssues.join('；'));
  }

  const total = Number(order.total);
  if (!Number.isFinite(total) || total <= 0) {
    addIssue(issues, 'INVALID_TOTAL', 'total 必須是大於 0 的有效數字');
  }

  const createAt = Number(order.create_at);
  if (!Number.isInteger(createAt) || createAt <= 0) {
    addIssue(issues, 'INVALID_DATE', 'create_at 必須是有效的 Unix timestamp');
  }

  if (typeof order.is_paid !== 'boolean') {
    addIssue(issues, 'INVALID_PAID_STATUS', 'is_paid 必須是 boolean');
  } else if (!order.is_paid) {
    const unpaidAge = getOrderUnpaidAge(order, now);

    if (unpaidAge?.level === 'overdue') {
      addIssue(issues, 'UNPAID_OVERDUE', `訂單已未付款 ${unpaidAge.ageDays} 天，建議優先聯繫確認`);
    } else if (unpaidAge?.level === 'review') {
      addIssue(issues, 'UNPAID_REVIEW', `訂單已未付款 ${unpaidAge.ageDays} 天，建議確認付款意願`);
    }
  }

  const errorCount = issues.filter((issue) => issue.severity === ORDER_HEALTH_STATUS.ERROR).length;
  const warningCount = issues.filter(
    (issue) => issue.severity === ORDER_HEALTH_STATUS.WARNING,
  ).length;
  const status = errorCount
    ? ORDER_HEALTH_STATUS.ERROR
    : warningCount
      ? ORDER_HEALTH_STATUS.WARNING
      : ORDER_HEALTH_STATUS.HEALTHY;

  return {
    orderId: order.id,
    orderKey: order.id || `order-${index}`,
    status,
    errorCount,
    warningCount,
    issues,
  };
};

export const analyzeOrderHealth = (orders = [], now = Date.now()) => {
  const byOrderId = {};
  const results = [];
  const issueGroupMap = new Map();
  const summary = {
    total: orders.length,
    healthy: 0,
    error: 0,
    warning: 0,
    paid: 0,
    unpaid: 0,
  };

  orders.forEach((order, index) => {
    const result = analyzeSingleOrder(order, index, now);
    byOrderId[result.orderKey] = result;
    results.push(result);
    summary[result.status] += 1;

    if (order.is_paid === true) summary.paid += 1;
    if (order.is_paid === false) summary.unpaid += 1;

    result.issues.forEach((issue) => {
      const group = issueGroupMap.get(issue.code) || {
        code: issue.code,
        label: issue.label,
        severity: issue.severity,
        count: 0,
        orderIds: [],
      };

      group.count += 1;
      group.orderIds.push(order.id || result.orderKey);
      issueGroupMap.set(issue.code, group);
    });
  });

  const issueGroups = [...issueGroupMap.values()].sort((left, right) => {
    if (left.severity !== right.severity) {
      return left.severity === ORDER_HEALTH_STATUS.ERROR ? -1 : 1;
    }

    return right.count - left.count;
  });

  return { summary, byOrderId, results, issueGroups };
};
