import { ARTICLE_ADMIN_FIELD_KEYS } from '@/schemas/articleAdminSchema';

const pickExportableArticleFields = (article) => {
  return ARTICLE_ADMIN_FIELD_KEYS.reduce((result, field) => {
    if (article[field] !== undefined) result[field] = article[field];
    return result;
  }, {});
};

export const buildArticleUpdateExport = (articles, exportedAt) => {
  const articleMap = articles.reduce((result, article) => {
    if (!article?.id) return result;

    result[article.id] = pickExportableArticleFields(article);
    return result;
  }, {});

  return {
    meta: {
      type: 'article',
      mode: 'update',
      exportedAt,
      total: Object.keys(articleMap).length,
    },
    articles: articleMap,
  };
};

export const buildArticleExportFilename = (date = new Date()) => {
  const localDate = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

  return `between-green-articles-${localDate}.json`;
};
