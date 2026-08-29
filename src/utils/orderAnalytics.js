import {
  ORDER_ANALYTICS_RANKING_LIMIT,
  ORDER_UNPAID_OVERDUE_DAYS,
  ORDER_UNPAID_REVIEW_DAYS,
} from '@/constants/orderConstants';
import { normalizeOrderItems } from '@/utils/orderItemUtils';
import {
  filterOrdersByExportPeriod,
  getOrderExportPeriod,
  getTaipeiCalendarSelection,
  ORDER_EXPORT_PERIOD_TYPES,
} from '@/utils/orderExporter';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const normalizeTimestampMilliseconds = (value) => {
  const timestamp = Number(value);
  if (!Number.isFinite(timestamp) || timestamp <= 0) return null;

  return timestamp > 100_000_000_000 ? timestamp : timestamp * 1000;
};

const getSafePositiveNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

const getQuarterKeyFromTimestamp = (timestamp) => {
  const timestampMilliseconds = normalizeTimestampMilliseconds(timestamp);
  if (timestampMilliseconds === null) return '';

  const selection = getTaipeiCalendarSelection(new Date(timestampMilliseconds));
  return `${selection.year}-Q${selection.quarter}`;
};

const parseQuarterKey = (quarterKey) => {
  const match = /^(\d{4})-Q([1-4])$/.exec(quarterKey || '');
  if (!match) return null;

  return { year: match[1], quarter: match[2] };
};

const getCustomerKey = (order) => {
  const email = order.user?.email?.trim().toLowerCase();
  if (email) return `email:${email}`;

  const telephone = order.user?.tel?.replace(/\D/g, '');
  return telephone ? `tel:${telephone}` : '';
};

const aggregateProducts = (orders) => {
  const productMap = new Map();

  orders.forEach((order) => {
    normalizeOrderItems(order.products).forEach((item) => {
      const key = item.productId || item.title;
      if (!key) return;

      const current = productMap.get(key) || {
        key,
        title: item.title || '未命名商品',
        quantity: 0,
        revenue: 0,
      };

      current.quantity += getSafePositiveNumber(item.qty);
      current.revenue += getSafePositiveNumber(item.total);
      productMap.set(key, current);
    });
  });

  return [...productMap.values()]
    .sort((left, right) => right.revenue - left.revenue || right.quantity - left.quantity)
    .slice(0, ORDER_ANALYTICS_RANKING_LIMIT);
};

const aggregateCustomers = (orders) => {
  const customerMap = new Map();

  orders.forEach((order) => {
    const key = getCustomerKey(order);
    if (!key) return;

    const current = customerMap.get(key) || {
      key,
      name: order.user?.name || order.user?.email || order.user?.tel || '未提供姓名',
      orderCount: 0,
      revenue: 0,
    };

    current.orderCount += 1;
    current.revenue += getSafePositiveNumber(order.total);
    customerMap.set(key, current);
  });

  const customers = [...customerMap.values()];
  const repeatCustomerCount = customers.filter((customer) => customer.orderCount >= 2).length;

  return {
    customerCount: customers.length,
    repeatCustomerCount,
    repeatCustomerRate: customers.length
      ? Math.round((repeatCustomerCount / customers.length) * 1000) / 10
      : 0,
    topCustomers: customers
      .sort((left, right) => right.revenue - left.revenue || right.orderCount - left.orderCount)
      .slice(0, ORDER_ANALYTICS_RANKING_LIMIT),
  };
};

export const getCurrentOrderQuarterKey = (now = Date.now()) => {
  const selection = getTaipeiCalendarSelection(new Date(now));
  return `${selection.year}-Q${selection.quarter}`;
};

export const getOrderQuarterPeriod = (quarterKey) => {
  const selection = parseQuarterKey(quarterKey);
  if (!selection) return null;

  return getOrderExportPeriod({
    periodType: ORDER_EXPORT_PERIOD_TYPES.QUARTER,
    month: '',
    year: selection.year,
    quarter: selection.quarter,
  });
};

export const getOrderQuarterOptions = (orders = [], now = Date.now()) => {
  const currentQuarterKey = getCurrentOrderQuarterKey(now);
  const quarterKeys = new Set([currentQuarterKey]);

  orders.forEach((order) => {
    const quarterKey = getQuarterKeyFromTimestamp(order.create_at);
    if (quarterKey) quarterKeys.add(quarterKey);
  });

  return [...quarterKeys]
    .sort((left, right) => right.localeCompare(left))
    .map((value) => ({
      value,
      label: getOrderQuarterPeriod(value)?.label || value,
    }));
};

export const getOrderUnpaidAge = (order, now = Date.now()) => {
  if (order?.is_paid !== false) return null;

  const createdAt = normalizeTimestampMilliseconds(order.create_at);
  if (createdAt === null) return null;

  const ageDays = Math.max(0, Math.floor((now - createdAt) / MILLISECONDS_PER_DAY));
  let level = 'recent';

  if (ageDays >= ORDER_UNPAID_OVERDUE_DAYS) level = 'overdue';
  else if (ageDays >= ORDER_UNPAID_REVIEW_DAYS) level = 'review';

  return { ageDays, level };
};

export const countOverdueUnpaidOrders = (orders = [], now = Date.now()) => {
  return orders.filter((order) => getOrderUnpaidAge(order, now)?.level === 'overdue').length;
};

export const analyzeOrderQuarter = (orders = [], quarterKey, now = Date.now()) => {
  const period = getOrderQuarterPeriod(quarterKey);
  const quarterOrders = period ? filterOrdersByExportPeriod(orders, period) : [];
  const paidOrders = quarterOrders.filter((order) => order.is_paid === true);
  const paidRevenue = paidOrders.reduce(
    (total, order) => total + getSafePositiveNumber(order.total),
    0,
  );
  const customerAnalytics = aggregateCustomers(paidOrders);
  const {
    customerCount,
    repeatCustomerCount,
    repeatCustomerRate,
    topCustomers,
  } = customerAnalytics;

  return {
    period,
    summary: {
      orderCount: quarterOrders.length,
      paidOrderCount: paidOrders.length,
      paidRevenue,
      averagePaidOrderValue: paidOrders.length ? Math.round(paidRevenue / paidOrders.length) : 0,
      paymentRate: quarterOrders.length
        ? Math.round((paidOrders.length / quarterOrders.length) * 1000) / 10
        : 0,
      overdueUnpaidCount: quarterOrders.filter(
        (order) => getOrderUnpaidAge(order, now)?.level === 'overdue',
      ).length,
      customerCount,
      repeatCustomerCount,
      repeatCustomerRate,
    },
    topProducts: aggregateProducts(paidOrders),
    topCustomers,
  };
};
