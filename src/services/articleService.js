import axiosAPI from '@/api/axiosAPI';

const normalizeArticleList = (source) => {
  if (Array.isArray(source)) return source;

  return Object.entries(source || {}).map(([id, article]) => ({
    ...article,
    id: article?.id || id,
  }));
};

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

export const getAllArticles = async () => {
  const firstPage = await getArticles(1);
  const totalPages = Number(firstPage.pagination?.total_pages) || 1;
  if (totalPages <= 1) {
    return { ...firstPage, data: normalizeArticleList(firstPage.data) };
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) => getArticles(index + 2)),
  );
  const allArticles = [
    ...normalizeArticleList(firstPage.data),
    ...remainingPages.flatMap((page) => normalizeArticleList(page.data)),
  ];

  return {
    data: [...new Map(allArticles.map((article, index) => [
      article.id || `__missing-id-${index}`,
      article,
    ])).values()],
    pagination: firstPage.pagination,
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

// Article API 沒有 /All endpoint；第一次載入依 pagination 取得完整集合。
export const getAllAdminArticles = async () => {
  const firstPage = await getAdminArticles(1);
  const totalPages = Number(firstPage.pagination?.total_pages) || 1;
  if (totalPages <= 1) {
    return { ...firstPage, data: normalizeArticleList(firstPage.data) };
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getAdminArticles(index + 2),
    ),
  );
  const allArticles = [
    ...normalizeArticleList(firstPage.data),
    ...remainingPages.flatMap((page) => normalizeArticleList(page.data)),
  ];

  return {
    data: [...new Map(allArticles.map((article, index) => [
      article.id || `__missing-id-${index}`,
      article,
    ])).values()],
    pagination: firstPage.pagination,
  };
};

// 後台單一文章
export const getAdminArticle = async (articleId) => {
  const { data } = await axiosAPI.get(`/admin/article/${articleId}`);

  return {
    data: data.article,
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
