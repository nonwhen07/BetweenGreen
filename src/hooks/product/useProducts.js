// import { useState, useEffect, useCallback } from 'react';
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
  // const [productTotalCount, setProductTotalCount] = useState(0);

  // 取得商品
  const fetchProducts = useCallback(async () => {
    start();

    try {
      // 現在改成全部撈出後前端filter(getAllAdminProducts)，未來有參數使用時再引用getAdminProducts(page指定、CATEGORY指定)
      // const res = isAdmin ? await getAdminProducts(params) : await getAllProducts();
      const res = isAdmin ? await getAllAdminProducts() : await getAllProducts();

      const productList = Object.values(res.data || {});

      setProducts(productList);
    } catch (error) {
      showError(extractErrorMessage(error));
    } finally {
      stop();
    }
    // [isAdmin, showError, start, stop]
  }, [isAdmin]);

  // // 後台商品總數
  // useEffect(() => {
  //   if (!isAdmin) return;

  //   const fetchProductCount = async () => {
  //     try {
  //       const { data } = await getAllAdminProducts();

  //       setProductTotalCount(Object.keys(data || {}).length);
  //     } catch (error) {
  //       showError(extractErrorMessage(error));
  //     }
  //   };

  //   fetchProductCount();
  //   // [isAdmin, showError]
  // }, [isAdmin]);

  return {
    products,
    // productTotalCount,
    // pageInfo,
    fetchProducts,
  };
};
