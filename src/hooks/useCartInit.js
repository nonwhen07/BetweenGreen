// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';

// import { getCartSummary } from '@/services/cartService';
// import { updateCartData } from '@/features/cart/cartSlice';
// import { handleApiError } from '@/utils/apiErrorHandler';
// import { useToast } from '@/hooks/useToast';

export const useCartInit = () => {
  // 初始化 dispatch
  // const dispatch = useDispatch();
  // const { showError } = useToast();
  // // 畫面渲染後初步載入購物車
  // useEffect(() => {
  //   const loadCart = async () => {
  //     try {
  //       const cartData = await getCartSummary();
  //       dispatch(updateCartData(cartData)); //將異動過後的購物車資料加入至store
  //     } catch (err) {
  //       // handleApiError 處理 error並在無法判斷時代入預設
  //       const errorMessage = handleApiError(err, null, '購物車資料匯入失敗，請稍後再試。');
  //       showError(errorMessage);
  //     }
  //   };
  //   loadCart();
  // }, [dispatch]);
};
