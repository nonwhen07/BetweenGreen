// hooks/cart/useAddToCart.js

import { useState } from 'react';

// hooks
import { useToast } from '@/hooks/useToast';
import { useCartActions } from '@/hooks/cart/useCartActions';

// services
import { addCartItem } from '@/services/cartService';

// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useAddToCart = () => {
  const [loadingItems, setLoadingItems] = useState({});

  const { showError, success } = useToast();
  const { refreshCart } = useCartActions();

  const handleAddCartItem = async (product_id, qty = 1) => {
    // 防止重複點擊
    if (loadingItems[product_id]) return;

    // 基本防呆
    if (!product_id || qty < 1) return;

    setLoadingItems((prev) => ({
      ...prev,
      [product_id]: true,
    }));

    try {
      await addCartItem(product_id, qty);

      await refreshCart();

      // success 可先保留
      success('已加入購物車');
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '加入購物車失敗');

      showError(errorMessage);
    } finally {
      setLoadingItems((prev) => ({
        ...prev,
        [product_id]: false,
      }));
    }
  };

  return {
    loadingItems,
    handleAddCartItem,
  };
};
