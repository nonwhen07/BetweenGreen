import { useCallback, useEffect, useState } from 'react';

import { getAllArticles } from '@/services/articleService';
import { extractErrorMessage } from '@/utils/errorHandler';

export const usePublicArticles = () => {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const response = await getAllArticles();
      setArticles(response.data || []);
      setStatus('success');
      return response.data || [];
    } catch (requestError) {
      const errorMessage = extractErrorMessage(
        requestError,
        null,
        '取得園藝文章失敗',
      );
      setError(errorMessage);
      setStatus('error');
      return [];
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, status, error, fetchArticles };
};
