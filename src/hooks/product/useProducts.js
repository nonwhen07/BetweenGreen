import { useState, useCallback } from 'react';

// services
import { getAllProducts, getAllAdminProducts } from '@/services/productService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useProducts = ({ isAdmin = false } = {}) => {
  const { showError } = useToast();
  const { start, stop } = useLoading();

  const [products, setProducts] = useState([]);

  // 取得商品
  const fetchProducts = useCallback(async () => {
    start();

    try {
      const res = isAdmin ? await getAllAdminProducts() : await getAllProducts();

      const productList = Object.values(res.data || {});

      setProducts(productList);
    } catch (error) {
      showError(extractErrorMessage(error));
    } finally {
      stop();
    }
  }, [isAdmin, showError, start, stop]);

  return {
    products,
    fetchProducts,
  };
};
