import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  ensureFrontProducts,
  fetchFrontProducts,
  selectFrontProducts,
  selectFrontProductsError,
  selectFrontProductsLastFetchedAt,
  selectFrontProductsStatus,
} from '@/features/product/frontProductSlice';

export const useProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectFrontProducts);
  const status = useSelector(selectFrontProductsStatus);
  const error = useSelector(selectFrontProductsError);
  const lastFetchedAt = useSelector(selectFrontProductsLastFetchedAt);

  const fetchProducts = useCallback(() => {
    return dispatch(ensureFrontProducts());
  }, [dispatch]);

  const refreshProducts = useCallback(() => {
    return dispatch(fetchFrontProducts());
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
