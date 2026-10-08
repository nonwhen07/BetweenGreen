import { useCallback, useEffect, useState } from 'react';

import { getAllArticles } from '@/services/articleService';
import { extractErrorMessage } from '@/utils/errorHandler';

export const usePublicArticles = () => {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [loadedAt, setLoadedAt] = useState(0);

  const fetchArticles = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const response = await getAllArticles();
      setArticles(response.data || []);
      setLoadedAt(Math.floor(Date.now() / 1000));
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
    const requestTimer = window.setTimeout(() => {
      fetchArticles();
    }, 0);

    return () => window.clearTimeout(requestTimer);
  }, [fetchArticles]);

  return { articles, status, error, fetchArticles, loadedAt };
};
