import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// features
import {
  ensureAdminArticles,
  fetchAdminArticles,
  removeAdminArticle,
  selectAdminArticles,
  selectAdminArticlesError,
  selectAdminArticlesLastFetchedAt,
  selectAdminArticlesStatus,
  upsertAdminArticle,
} from '@/features/article/articleSlice';

export const useAdminArticles = () => {
  const dispatch = useDispatch();
  const articles = useSelector(selectAdminArticles);
  const status = useSelector(selectAdminArticlesStatus);
  const error = useSelector(selectAdminArticlesError);
  const lastFetchedAt = useSelector(selectAdminArticlesLastFetchedAt);

  const fetchArticles = useCallback(
    () => dispatch(ensureAdminArticles()),
    [dispatch],
  );
  const refreshArticles = useCallback(
    ({ background = false } = {}) =>
      dispatch(fetchAdminArticles({ background })).unwrap(),
    [dispatch],
  );
  const saveArticleToStore = useCallback(
    (article) => dispatch(upsertAdminArticle(article)),
    [dispatch],
  );
  const removeArticleFromStore = useCallback(
    (articleId) => dispatch(removeAdminArticle(articleId)),
    [dispatch],
  );

  return {
    articles,
    status,
    error,
    lastFetchedAt,
    fetchArticles,
    refreshArticles,
    saveArticleToStore,
    removeArticleFromStore,
  };
};
