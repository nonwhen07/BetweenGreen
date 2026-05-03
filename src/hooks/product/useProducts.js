import { useState, useCallback } from 'react';

// services
import { getProducts, getAdminProducts } from '@/services/productService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useProducts = ({ isAdmin = false } = {}) => {
  const { showError } = useToast();
  const { start, stop } = useLoading();

  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  // const [isLoading, setIsLoading] = useState(false);

  // 統一入口
  const fetchProducts = useCallback(
    async (params = {}) => {
      // setIsLoading(true);
      start();

      try {
        const res = isAdmin ? await getAdminProducts(params) : await getProducts(params);

        setProducts(res.data || []);
        setPageInfo(res.pagination || {});
      } catch (error) {
        showError(extractErrorMessage(error));
      } finally {
        // setIsLoading(false);
        stop();
      }
    },
    [isAdmin, showError],
  );

  return {
    products,
    pageInfo,
    fetchProducts,
    // isLoading,
  };
};
