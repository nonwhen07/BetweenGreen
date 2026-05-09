import axiosAPI from '@/api/axiosAPI';

/**
 * =====================================
 * Product Service
 * =====================================
 */

/**
 * ===== Front API =====
 */

// 取得商品列表（分頁和分類的 params）
// params 使用方式：
// getProducts({ page: 1 });、getProducts({ category: '咖啡' });、getProducts({ page: 2, category: '咖啡' });
export const getProducts = async (params = {}) => {
  const { data } = await axiosAPI.get('/products', {
    params,
  });

  return {
    data: data.products,
    pagination: data.pagination,
  };
};

// 取得單一商品
export const getProductDetail = async (product_id) => {
  const { data } = await axiosAPI.get(`/product/${product_id}`);

  return {
    data: data.product,
  };
};

/**
 * ===== Admin API =====
 */

// 後台All商品列表
export const getAllAdminProducts = async () => {
  const { data } = await axiosAPI.get('/admin/products/All');

  return {
    data: data.products,
    pagination: data.pagination,
  };
};

// 後台商品列表
export const getAdminProducts = async (params = {}) => {
  const { data } = await axiosAPI.get('/admin/products', {
    params,
  });

  return {
    data: data.products,
    pagination: data.pagination,
  };
};

// 新增商品
export const createProduct = async (productData) => {
  const { data } = await axiosAPI.post('/admin/product', {
    data: productData,
  });

  return data;
};

// 更新商品
export const updateProduct = async (productId, productData) => {
  const { data } = await axiosAPI.put(`/admin/product/${productId}`, {
    data: productData,
  });

  return data;
};

// 刪除商品
export const deleteProduct = async (productId) => {
  const { data } = await axiosAPI.delete(`/admin/product/${productId}`);

  return data;
};
