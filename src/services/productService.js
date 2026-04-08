import axiosAPI from '@/api/axiosAPI';
// import axiosAdmin from '@/api/axiosAdmin';

// ===== Front API =====
// 取得商品列表
export const getProducts = async () => {
  const res = await axiosAPI.get('/products');
  return res.data.products;
};

// 取得商品列表 By Category
export const getProductsByCategory = async (category = 'Tools') => {
  const res = await axiosAPI.get('/products', {
    params: {
      category: category,
    },
  });
  return res.data.products;
};

// 取得商品詳細
export const getProductDetail = async (productId) => {
  const res = await axiosAPI.get(`/product/${productId}`);
  return res.data.product;
};

// ===== Admin API =====
// 後台商品列表
export const getAdminProducts = async (page = 1) => {
  const { data } = await axiosAPI.get('/admin/products', {
    params: { page },
  });

  return {
    products: data.products,
    pagination: data.pagination,
  };
};

// 新增商品
export const createProduct = async (productData) => {
  const res = await axiosAPI.post('/admin/product', {
    data: productData,
  });
  return res.data;
};

// 更新商品
export const updateProduct = async (productId, productData) => {
  const res = await axiosAPI.put(`/admin/product/${productId}`, {
    data: productData,
  });
  return res.data;
};

// 刪除商品
export const deleteProduct = async (productId) => {
  const res = await axiosAPI.delete(`/admin/product/${productId}`);
  return res.data;
};
