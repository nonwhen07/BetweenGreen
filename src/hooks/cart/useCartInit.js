import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// services
import { getCartSummary } from '@/services/cartService';
// features
import { updateCartData } from '@/features/cart/cartSlice';
// hooks
import { useToast } from '@/hooks/useToast';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useCartInit = () => {
  // 初始化 dispatch
  const dispatch = useDispatch();
  const { showError } = useToast();

  // 畫面渲染後初步載入購物車
  useEffect(() => {
    const initCartStore = async () => {
      try {
        const cartData = await getCartSummary();
        dispatch(updateCartData(cartData)); //將異動過後的購物車資料加入至store
      } catch (err) {
        // extractErrorMessage 處理 error並在無法判斷時代入預設
        const errorMessage = extractErrorMessage(err, null, '購物車資料匯入失敗，請稍後再試。');
        showError(errorMessage);
      }
    };

    initCartStore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
};
