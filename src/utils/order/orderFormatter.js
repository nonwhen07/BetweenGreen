export const normalizeOrderList = (source) => {
  if (Array.isArray(source)) return source;

  return Object.entries(source || {}).map(([id, order]) => ({
    ...order,
    id: order?.id || id,
  }));
};

export const formatOrderCurrency = (value = 0) => {
  const number = Number(value);

  return Math.round(Number.isFinite(number) ? number : 0).toLocaleString();
};

export const formatOrderDateTime = (timestamp) => {
  const numericTimestamp = Number(timestamp);

  if (!Number.isFinite(numericTimestamp) || numericTimestamp <= 0) {
    return '未設定';
  }

  return new Date(numericTimestamp * 1000).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const getOrderCustomerName = (order = {}) => {
  return order.user?.name || order.user?.email || '未提供顧客資料';
};

