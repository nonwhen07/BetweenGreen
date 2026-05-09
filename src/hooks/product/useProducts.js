import { useState, useEffect, useCallback } from 'react';

// services
import { getProducts, getAdminProducts, getAllAdminProducts } from '@/services/productService';
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
  const [productTotalCount, setProductTotalCount] = useState(0);

  // 統一入口
  const fetchProducts = useCallback(
    async (params = {}) => {
      start();

      try {
        // const res = isAdmin ? await getAdminProducts(params) : await getProducts(params);
        const res = isAdmin ? await getAdminProducts(params) : await getProducts(params.page || 1);

        setProducts(res.data || []);
        setPageInfo(res.pagination || {});
      } catch (error) {
        showError(extractErrorMessage(error));
      } finally {
        // setIsLoading(false);
        stop();
      }
    },
    [isAdmin],
  );

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const { data } = await getAllAdminProducts();

        setProductTotalCount(Object.keys(data).length);
      } catch (error) {
        showError(extractErrorMessage(error));
      }
    };

    if (isAdmin) {
      fetchProductCount();
    }
  }, [isAdmin]);

  return {
    products,
    productTotalCount,
    pageInfo,
    fetchProducts,
  };
};
