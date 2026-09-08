import { useMemo } from 'react';

import { analyzeOrderUnpaidAging } from '@/utils/order/orderAnalytics';

export const useOrderUnpaidAging = (orders = []) => {
  return useMemo(() => analyzeOrderUnpaidAging(orders), [orders]);
};
