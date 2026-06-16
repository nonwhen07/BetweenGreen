import axiosAPI from '@/api/axiosAPI';

/**
 * =====================================
 * Order Service
 * =====================================
 */

/**
 * ===== Front API =====
 */

// 建立訂單 - 購物車送出並轉換成訂單
export const createOrder = async (orderPayload) => {
  const { data } = await axiosAPI.post('/order', orderPayload);
  return data;
};

// 取得訂單列表（分頁）
export const getOrders = async (page = 1) => {
  const { data } = await axiosAPI.get('/orders', {
    params: { page },
  });

  return {
    data: data.orders,
    pagination: data.pagination,
  };
};

// 取得單一訂單
export const getOrder = async (orderId) => {
  const { data } = await axiosAPI.get(`/order/${orderId}`);

  return {
    data: data.order,
  };
};

// 訂單付款
export const payOrder = async (orderId) => {
  const { data } = await axiosAPI.post(`/pay/${orderId}`);

  return {
    data: data.order,
  };
};

/**
 * ===== Admin API =====
 */

// 後台訂單列表
export const getAdminOrders = async (page = 1) => {
  const { data } = await axiosAPI.get('/admin/orders', {
    params: { page },
  });

  return {
    data: data.orders,
    pagination: data.pagination,
  };
};

// 更新訂單（ Hex API 只能改 is_paid）
export const updateOrder = async (orderId, orderData) => {
  const payload = {
    is_paid: orderData.is_paid,
  };

  const { data } = await axiosAPI.put(`/admin/order/${orderId}`, {
    data: payload,
  });

  return data;
};

// 刪除單一訂單
export const deleteOrder = async (orderId) => {
  const { data } = await axiosAPI.delete(`/admin/order/${orderId}`);

  return data;
};

// 刪除全部訂單
export const deleteAllOrders = async () => {
  const { data } = await axiosAPI.delete(`/admin/orders/all`);

  return data;
};
