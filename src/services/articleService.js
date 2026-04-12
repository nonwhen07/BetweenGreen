import axiosAPI from '@/api/axiosAPI';

/**
 * =====================================
 * Article Service
 * =====================================
 */

/**
 * ===== Front API =====
 */

// 前台文章列表
export const getArticles = async (page = 1) => {
  const { data } = await axiosAPI.get('/articles', {
    params: { page },
  });

  return {
    data: data.articles,
    pagination: data.pagination,
  };
};

// 前台單一文章
export const getArticle = async (articleId) => {
  const { data } = await axiosAPI.get(`/article/${articleId}`);

  return {
    data: data.article,
  };
};

/**
 * ===== Admin API =====
 */

// 後台文章列表
export const getAdminArticles = async (page = 1) => {
  const { data } = await axiosAPI.get('/admin/articles', {
    params: { page },
  });

  return {
    data: data.articles,
    pagination: data.pagination,
  };
};

// 新增文章
export const createArticle = async (articleData) => {
  const { data } = await axiosAPI.post('/admin/article', {
    data: articleData,
  });

  return data;
};

// 更新文章
export const updateArticle = async (articleId, articleData) => {
  const { data } = await axiosAPI.put(`/admin/article/${articleId}`, {
    data: articleData,
  });

  return data;
};

// 刪除文章
export const deleteArticle = async (articleId) => {
  const { data } = await axiosAPI.delete(`/admin/article/${articleId}`);

  return data;
};
