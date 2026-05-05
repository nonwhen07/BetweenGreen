import { useState, useCallback } from 'react';

// services
import { getArticles, getAdminArticles } from '@/services/articleService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useArticles = ({ isAdmin = false } = {}) => {
  const { showError } = useToast();
  const { start, stop } = useLoading();

  const [articles, setArticles] = useState([]);
  const [pageInfo, setPageInfo] = useState({});

  const fetchArticles = useCallback(
    async (params = {}) => {
      start();

      try {
        const res = isAdmin ? await getAdminArticles(params) : await getArticles(params);

        setArticles(res.data || []);
        setPageInfo(res.pagination || {});
      } catch (error) {
        showError(extractErrorMessage(error));
      } finally {
        stop();
      }
    },
    [isAdmin, showError],
  );

  return {
    articles,
    pageInfo,
    fetchArticles,
  };
};
