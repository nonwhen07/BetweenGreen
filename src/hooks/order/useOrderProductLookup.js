import { useMemo } from 'react';

// hooks
import { useAdminProducts } from '@/hooks/product/useAdminProducts';
// utils
import { createOrderProductLookup } from '@/utils/order/orderItemUtils';

export const useOrderProductLookup = () => {
  const { products, status: productCatalogStatus, fetchProducts } = useAdminProducts();
  const productLookup = useMemo(() => createOrderProductLookup(products), [products]);

  return {
    productLookup,
    productCatalogStatus,
    ensureProductCatalog: fetchProducts,
  };
};
