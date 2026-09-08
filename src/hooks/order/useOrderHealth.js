import { useMemo } from 'react';

import { analyzeOrderHealth } from '@/utils/order/orderHealthAnalyzer';

export const useOrderHealth = (orders = []) => {
  return useMemo(() => analyzeOrderHealth(orders), [orders]);
};
