// 單篇資料才是正文來源；不以列表或預設空字串補成「完整匯出」。
// fetchArticle 沿用 getAdminArticle 的 { data: article } 回傳契約。
export const loadCompleteArticlesForExport = async (articles, fetchArticle) => {
  if (!Array.isArray(articles) || articles.length === 0) {
    throw new Error('目前沒有可匯出的文章資料');
  }
  const snapshot = articles.map((article) => ({ id: article?.id, title: article?.title }));
  const ids = new Set();
  snapshot.forEach(({ id }) => {
    if (typeof id !== 'string' || !id.trim()) throw new Error('文章 ID 不完整，請重新整理列表後再匯出');
    if (ids.has(id)) throw new Error('文章 ID 重複，請重新整理列表後再匯出');
    ids.add(id);
  });

  const results = new Array(snapshot.length);
  let cursor = 0;
  let failure = null;
  const worker = async () => {
    while (!failure && cursor < snapshot.length) {
      const index = cursor;
      cursor += 1;
      const item = snapshot[index];
      try {
        const response = await fetchArticle(item.id);
        const detail = response?.data;
        if (!detail || typeof detail !== 'object' || Array.isArray(detail)) {
          throw new Error('單篇 API 未回傳文章物件');
        }
        if (detail.id != null && detail.id !== item.id) {
          throw new Error('單篇回應的文章 ID 與請求不一致');
        }
        if (typeof detail.content !== 'string') {
          throw new Error('單篇回應未提供文字格式的 content');
        }
        // API 省略 id 時沿用請求 id；其他欄位只採用單篇資料，避免混入舊列表值。
        results[index] = { ...detail, id: item.id };
      } catch (error) {
        failure ??= new Error(`「${item.title || item.id}」完整資料取得失敗，已取消匯出。${error?.message || '請稍後再試'}`);
      }
    }
  };

  // 限制同時最多三個請求；失敗後停止排入新請求，等待已發出的請求結束。
  await Promise.all(Array.from({ length: Math.min(3, snapshot.length) }, worker));
  if (failure) throw failure;
  return results;
};
