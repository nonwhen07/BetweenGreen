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

// // 依分類取得商品（分頁）
// export const getProductsByCategory = async ({ page = 1, category } = {}) => {
//   const { data } = await axiosAPI.get('/products', {
//     params: {
//       page,
//       ...(category && { category }),
//     },
//   });

//   return {
//     data: data.products,
//     pagination: data.pagination,
//   };
// };

// 取得單一商品
export const getProductDetail = async (productId) => {
  const { data } = await axiosAPI.get(`/product/${productId}`);

  return {
    data: data.product,
  };
};

/**
 * ===== Admin API =====
 */

// 後台商品列表
export const getAdminProducts = async (page = 1) => {
  const { data } = await axiosAPI.get('/admin/products', {
    params: { page },
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
