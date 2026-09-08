const ORDER_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TAIPEI_OFFSET = '+08:00';

const normalizeSearchText = (value) =>
  String(value ?? '').trim().toLocaleLowerCase();

export const isValidOrderDate = (value) => {
  if (!value) return true;
  if (!ORDER_DATE_PATTERN.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const getOrderDateRangeError = (dateFrom, dateTo) => {
  if (!isValidOrderDate(dateFrom) || !isValidOrderDate(dateTo)) {
    return '日期格式不正確';
  }

  if (dateFrom && dateTo && dateFrom > dateTo) {
    return '開始日期不可晚於結束日期';
  }

  return '';
};

const getOrderSearchText = (order = {}) => {
  return [order.id, order.user?.name, order.user?.email, order.user?.tel]
    .map(normalizeSearchText)
    .join('\n');
};

const getOrderTimestampMs = (order = {}) => {
  const timestamp = Number(order.create_at);

  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp * 1000 : null;
};

const getTaipeiDateBoundary = (date, isEndOfDay = false) => {
  if (!date || !isValidOrderDate(date)) return null;

  const time = isEndOfDay ? '23:59:59.999' : '00:00:00.000';
  return Date.parse(`${date}T${time}${TAIPEI_OFFSET}`);
};

export const filterOrdersBySearch = (
  orders = [],
  { keyword = '', dateFrom = '', dateTo = '' } = {},
) => {
  if (getOrderDateRangeError(dateFrom, dateTo)) return [];

  const normalizedKeyword = normalizeSearchText(keyword);
  const rangeStart = getTaipeiDateBoundary(dateFrom);
  const rangeEnd = getTaipeiDateBoundary(dateTo, true);

  return orders.filter((order) => {
    const matchesKeyword =
      !normalizedKeyword ||
      getOrderSearchText(order).includes(normalizedKeyword);

    if (!matchesKeyword) return false;
    if (rangeStart === null && rangeEnd === null) return true;

    const orderTimestamp = getOrderTimestampMs(order);
    if (orderTimestamp === null) return false;

    return (
      (rangeStart === null || orderTimestamp >= rangeStart) &&
      (rangeEnd === null || orderTimestamp <= rangeEnd)
    );
  });
};
