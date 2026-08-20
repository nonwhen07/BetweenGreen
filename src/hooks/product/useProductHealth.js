import { useMemo } from 'react';

// utils
import { analyzeProductHealth } from '@/utils/productHealthAnalyzer';

export const useProductHealth = (products = []) => {
  return useMemo(() => analyzeProductHealth(products), [products]);
};
