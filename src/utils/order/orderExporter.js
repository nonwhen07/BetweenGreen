const TAIPEI_OFFSET_HOURS = 8;
const TAIPEI_OFFSET_MS = TAIPEI_OFFSET_HOURS * 60 * 60 * 1000;

export const ORDER_EXPORT_PERIOD_TYPES = {
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
};

const padNumber = (value) => String(value).padStart(2, '0');

const assertYear = (year) => {
  const normalizedYear = Number(year);

  if (
    !Number.isInteger(normalizedYear) ||
    normalizedYear < 2000 ||
    normalizedYear > 9999
  ) {
    throw new Error('請輸入 2000～9999 之間的有效年份');
  }

  return normalizedYear;
};

const createTaipeiBoundary = (year, monthIndex) => {
  const normalizedDate = new Date(Date.UTC(year, monthIndex, 1));
  const boundaryYear = normalizedDate.getUTCFullYear();
  const boundaryMonthIndex = normalizedDate.getUTCMonth();
  const timestampMs =
    Date.UTC(boundaryYear, boundaryMonthIndex, 1) - TAIPEI_OFFSET_MS;

  return {
    timestampSeconds: Math.floor(timestampMs / 1000),
    iso: `${boundaryYear}-${padNumber(boundaryMonthIndex + 1)}-01T00:00:00+08:00`,
  };
};

export const getTaipeiCalendarSelection = (date = new Date()) => {
  const taipeiDate = new Date(date.getTime() + TAIPEI_OFFSET_MS);
  const year = taipeiDate.getUTCFullYear();
  const monthNumber = taipeiDate.getUTCMonth() + 1;

  return {
    month: `${year}-${padNumber(monthNumber)}`,
    year: String(year),
    quarter: String(Math.floor((monthNumber - 1) / 3) + 1),
  };
};

export const getOrderExportPeriod = ({ periodType, month, year, quarter }) => {
  let periodYear;
  let startMonthIndex;
  let endMonthIndex;
  let periodKey;
  let label;

  if (periodType === ORDER_EXPORT_PERIOD_TYPES.MONTH) {
    const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(month || '');
    if (!match) throw new Error('請選擇有效月份');

    periodYear = assertYear(match[1]);
    startMonthIndex = Number(match[2]) - 1;
    endMonthIndex = startMonthIndex + 1;
    periodKey = `${periodYear}-${match[2]}`;
    label = `${periodYear} 年 ${Number(match[2])} 月`;
  } else if (periodType === ORDER_EXPORT_PERIOD_TYPES.QUARTER) {
    periodYear = assertYear(year);
    const normalizedQuarter = Number(quarter);
    if (
      !Number.isInteger(normalizedQuarter) ||
      normalizedQuarter < 1 ||
      normalizedQuarter > 4
    ) {
      throw new Error('請選擇有效季度');
    }

    startMonthIndex = (normalizedQuarter - 1) * 3;
    endMonthIndex = startMonthIndex + 3;
    periodKey = `${periodYear}-Q${normalizedQuarter}`;
    label = `${periodYear} 年第 ${normalizedQuarter} 季`;
  } else if (periodType === ORDER_EXPORT_PERIOD_TYPES.YEAR) {
    periodYear = assertYear(year);
    startMonthIndex = 0;
    endMonthIndex = 12;
    periodKey = String(periodYear);
    label = `${periodYear} 年`;
  } else {
    throw new Error('請選擇有效的匯出期間類型');
  }

  const start = createTaipeiBoundary(periodYear, startMonthIndex);
  const end = createTaipeiBoundary(periodYear, endMonthIndex);

  return {
    periodType,
    periodKey,
    label,
    timezone: 'Asia/Taipei',
    startEpochSeconds: start.timestampSeconds,
    endExclusiveEpochSeconds: end.timestampSeconds,
    startAt: start.iso,
    endAtExclusive: end.iso,
  };
};

const normalizeTimestampSeconds = (value) => {
  const timestamp = Number(value);
  if (!Number.isFinite(timestamp)) return null;

  return timestamp > 100_000_000_000
    ? Math.floor(timestamp / 1000)
    : Math.floor(timestamp);
};

export const filterOrdersByExportPeriod = (orders = [], period) => {
  return orders
    .filter((order) => {
      const timestamp = normalizeTimestampSeconds(order?.create_at);
      if (timestamp === null) return false;

      return (
        timestamp >= period.startEpochSeconds &&
        timestamp < period.endExclusiveEpochSeconds
      );
    })
    .sort(
      (left, right) =>
        normalizeTimestampSeconds(left.create_at) -
        normalizeTimestampSeconds(right.create_at),
    );
};

export const buildOrderArchiveExport = (orders, period, exportedAt) => {
  return {
    meta: {
      type: 'order',
      mode: 'archive',
      periodType: period.periodType,
      periodKey: period.periodKey,
      timezone: period.timezone,
      startAt: period.startAt,
      endAtExclusive: period.endAtExclusive,
      exportedAt,
      total: orders.length,
    },
    orders,
  };
};

export const buildOrderExportFilename = (period) => {
  return `between-green-orders-${period.periodKey}.json`;
};
