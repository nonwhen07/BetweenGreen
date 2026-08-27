import { useMemo } from 'react';

import { analyzeArticleHealth } from '@/utils/articleHealthAnalyzer';

export const useArticleHealth = (articles = []) => {
  return useMemo(() => analyzeArticleHealth(articles), [articles]);
};
