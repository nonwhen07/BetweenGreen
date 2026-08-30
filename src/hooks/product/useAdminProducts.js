import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// features
import {
  ensureAdminProducts,
  fetchAdminProducts,
  selectAdminProducts,
  selectAdminProductsError,
  selectAdminProductsLastFetchedAt,
  selectAdminProductsStatus,
} from '@/features/product/productSlice';

export const useAdminProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAdminProducts);
  const status = useSelector(selectAdminProductsStatus);
  const error = useSelector(selectAdminProductsError);
  const lastFetchedAt = useSelector(selectAdminProductsLastFetchedAt);

  // 初始載入：已有 Store 快取時直接沿用。
  const fetchProducts = useCallback(() => {
    return dispatch(ensureAdminProducts());
  }, [dispatch]);

  // CRUD／批次匯入完成：強制向 API 重新取得一次。
  const refreshProducts = useCallback(({ background = false } = {}) => {
    return dispatch(fetchAdminProducts({ background })).unwrap();
  }, [dispatch]);

  return {
    products,
    status,
    error,
    lastFetchedAt,
    fetchProducts,
    refreshProducts,
  };
};
