import { useMemo, useState } from 'react';

import {
  analyzeOrderQuarter,
  countOverdueUnpaidOrders,
  getCurrentOrderQuarterKey,
  getOrderQuarterOptions,
} from '@/utils/order/orderAnalytics';

export const useOrderQuarterlyAnalytics = (orders = [], requestedQuarter = '') => {
  const [referenceTime] = useState(Date.now);
  const quarterOptions = useMemo(
    () => getOrderQuarterOptions(orders, referenceTime),
    [orders, referenceTime],
  );
  const currentQuarterKey = getCurrentOrderQuarterKey(referenceTime);
  const selectedQuarter = quarterOptions.some((option) => option.value === requestedQuarter)
    ? requestedQuarter
    : currentQuarterKey;
  const analytics = useMemo(
    () => analyzeOrderQuarter(orders, selectedQuarter, referenceTime),
    [orders, referenceTime, selectedQuarter],
  );
  const allOverdueUnpaidCount = useMemo(
    () => countOverdueUnpaidOrders(orders, referenceTime),
    [orders, referenceTime],
  );

  return {
    analytics,
    quarterOptions,
    selectedQuarter,
    currentQuarterKey,
    allOverdueUnpaidCount,
  };
};
