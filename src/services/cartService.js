import axiosAPI from '@/api/axiosAPI';

// 取得購物車列表
export const getCartItems = async () => {
  const res = await axiosAPI.get('/cart');
  return res.data.data.carts;
};
// 取得購物車列表 + 剩餘完整資料
export const getCartSummary = async () => {
  const res = await axiosAPI.get('/cart');
  return res.data.data;
};

// 加入單一品項 到 購物車
export const addsCartItem = async (productId, qty) => {
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

// 結帳
export const createOrder = async (orderData) => {
  await axiosAPI.post('/order', orderData);
};
