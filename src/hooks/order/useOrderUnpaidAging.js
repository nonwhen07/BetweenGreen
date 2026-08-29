import { useMemo } from 'react';

import { analyzeOrderUnpaidAging } from '@/utils/orderAnalytics';

export const useOrderUnpaidAging = (orders = []) => {
  return useMemo(() => analyzeOrderUnpaidAging(orders), [orders]);
};
