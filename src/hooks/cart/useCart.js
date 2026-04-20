import { useState } from 'react';

// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
// import { useCart } from '@/hooks/useCart';
import { useCartActions } from '@/hooks/cart/useCartActions';
// services
import { getCartItems, updateCartItem, deleteCartItem, clearCart } from '@/services/cartService';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useCart = () => {
  const [carts, setCarts] = useState([]);
  const [loadingItems, setLoadingItems] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { success, showError } = useToast();
  const { start, stop } = useLoading();

  const { refreshCart } = useCartActions();

  const fetchCart = async () => {
    const carts = await getCartItems();
    setCarts(carts);
    await refreshCart();
  };

  // 調整購物車品項
  const handleUpdateCartItem = async (cart_id, product_id, qty = 1) => {
    // 如果 qty 小於 1，直接返回不做任何處理 作法A
    // 如果 qty 小於 1，直接刪掉cart item 作法B
    if (qty < 1) {
      const confirmDelete = window.confirm('商品數量為 0 會直接刪除購物車品項，確定要刪除嗎？');

      if (!confirmDelete) return;

      await handleDeleteCartItem(cart_id);
      // 成功後刷新購物車 + 更新全局購物車狀態
      await fetchCart();
      return;
    }

    setLoadingItems((prev) => ({
      ...prev,
      [cart_id]: 'qty',
    }));

    try {
      await updateCartItem(cart_id, product_id, qty);
      // 成功後刷新購物車 + 更新全局購物車狀態
      await fetchCart();
      setError('');
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '調整購物車數量失敗');
      showError(errorMessage);
    } finally {
      setLoadingItems((prev) => {
        const newState = { ...prev };
        delete newState[cart_id];
        return newState;
      });
    }
  };
  // 刪除購物車品項
  const handleDeleteCartItem = async (cart_id) => {
    // 改為在局部按鈕上顯示 loading， 避免整個畫面都被遮罩，提升使用體驗

    setLoadingItems((prev) => ({
      ...prev,
      [cart_id]: 'delete',
    }));
    try {
      await deleteCartItem(cart_id);
      // 成功後刷新購物車 + 更新全局購物車狀態
      await fetchCart();
      setError('');
    } catch (error) {
      const errorMessage = extractErrorMessage(error, setError, '刪除購物車品項失敗');
      showError(errorMessage);
    } finally {
      setLoadingItems((prev) => {
        const newState = { ...prev };
        delete newState[cart_id];
        return newState;
      });
    }
  };
  // 移除全部購物車品項
  const handleClearCart = async () => {
    if (!window.confirm('確定要清空購物車嗎？')) return;
    start();
    try {
      await clearCart();
      await fetchCart();

      setError('');

      success('清空全部購物車成功。');
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '清空全部購物車失敗');
      showError(errorMessage);
    } finally {
      stop();
    }
  };

  return {
    carts,

    loadingItems,
    error,
    fetchCart,
    handleUpdateCartItem,
    handleDeleteCartItem,
    handleClearCart,
  };
};
