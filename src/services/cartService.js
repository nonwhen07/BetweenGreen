import axiosAPI from '@/api/axiosAPI';
import { normalizeCartData } from '@/utils/cartUtils';

// 取得購物車列表 + 剩餘完整資料
export const getCartSummary = async () => {
  const res = await axiosAPI.get('/cart');

  return normalizeCartData(res?.data);
};

// 加入單一品項 到 購物車
export const addCartItem = async (productId, qty) => {
  await axiosAPI.post(`/cart/`, {
    data: {
      product_id: productId,
      qty: Number(qty),
    },
  });
};
// 購物車清單中 調整數量
export const updateCartItem = async (cartId, productId, qty) => {
  await axiosAPI.put(`/cart/${cartId}`, {
    data: {
      product_id: productId,
      qty: Number(qty),
    },
  });
};

// 刪除購物車項目
export const deleteCartItem = async (cartId) => {
  await axiosAPI.delete(`/cart/${cartId}`);
};

// 清空購物車
export const clearCart = async () => {
  await axiosAPI.delete('/carts');
};

// // 購物車送出並轉換成訂單，並取得訂單資料(未來可能可以搬出去orderService，和orders查詢整合)
// export const createOrder = async (orderData) => {
//   const res = await axiosAPI.post('/order', orderData);
//   return res.data;
// };
