import { useCallback, useState } from 'react';

// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { useCartActions } from '@/hooks/cart/useCartActions';
// services
import { updateCartItem, deleteCartItem, clearCart } from '@/services/cartService';
import { applyCoupon } from '@/services/couponService';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

const EMPTY_CART_DATA = {
  carts: [],
  total: 0,
  final_total: 0,
};

export const useCart = () => {
  // const [carts, setCarts] = useState([]);
  // const [loadingItems, setLoadingItems] = useState({});

  // const [error, setError] = useState('');
  const [cartData, setCartData] = useState(EMPTY_CART_DATA);
  const [loadingItems, setLoadingItems] = useState({});
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [error, setError] = useState('');

  const { success, showError } = useToast();
  const { start, stop } = useLoading();

  const { refreshCart } = useCartActions();

  const carts = cartData.carts || [];

  const fetchCart = useCallback(async () => {
    const data = await refreshCart();
    const carts = data.carts || [];

    const calculatedTotal = carts.reduce((total, cart) => total + Number(cart.total || 0), 0);

    const nextCartData = {
      carts,
      total: Number(data?.total ?? calculatedTotal),
      final_total: Number(data?.final_total ?? data?.total ?? calculatedTotal),
    };

    setCartData(nextCartData);

    return nextCartData;
  }, [refreshCart]);

  // 調整購物車品項
  const handleUpdateCartItem = async (cart_id, product_id, qty = 1) => {
    // 如果 qty 小於 1，直接返回不做任何處理 作法A 或 直接刪掉cart item 作法B
    if (qty < 1) {
      const confirmDelete = window.confirm('商品數量為 0 會直接刪除購物車品項，確定要刪除嗎？');

      if (!confirmDelete) return;

      await handleDeleteCartItem(cart_id);
      return;
    }

    setLoadingItems((prev) => ({
      ...prev,
      [cart_id]: 'qty',
    }));

    try {
      await updateCartItem(cart_id, product_id, qty);
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
  // 購物車中輸入優惠卷
  const handleApplyCoupon = async (couponCode) => {
    // await applyCoupon(couponCode);
    // await fetchCart();
    const trimmedCode = couponCode.trim();

    if (!trimmedCode) {
      showError('請輸入優惠碼。');
      return;
    }

    setIsCouponLoading(true);

    try {
      await applyCoupon(trimmedCode);
      await fetchCart();

      setError('');
      success('優惠碼已套用。');
    } catch (error) {
      const errorMessage = extractErrorMessage(error, setError, '優惠碼套用失敗。');
      showError(errorMessage);
    } finally {
      setIsCouponLoading(false);
    }
  };

  return {
    cartData,
    carts,

    loadingItems,
    isCouponLoading,
    error,

    fetchCart,
    handleUpdateCartItem,
    handleDeleteCartItem,
    handleClearCart,
    handleApplyCoupon,
  };
};
