import { DEFAULT_ARTICLE } from '@/constants/articleConstants';
import { normalizeArticleAdminData } from '@/schemas/articleAdminSchema';
import {
  formatDateInputToUnix,
  formatOptionalDateToUnix,
  formatUnixToDateInput,
} from '@/utils/adminBuilderUtils';

export const formatArticleForForm = (article = {}) => ({
  ...DEFAULT_ARTICLE,
  ...article,
  create_at: formatUnixToDateInput(article.create_at),
  publishStart: formatUnixToDateInput(article.publishStart),
  publishEnd: formatUnixToDateInput(article.publishEnd),
  isPublic: Boolean(article.isPublic),
  tag: Array.isArray(article.tag) ? article.tag : [],
});

export const formatArticleForApi = (formData = {}, selectedTags = []) => {
  return normalizeArticleAdminData({
    ...formData,
    tag: selectedTags,
    create_at: formatDateInputToUnix(formData.create_at),
    publishStart: formatOptionalDateToUnix(formData.publishStart),
    publishEnd: formatOptionalDateToUnix(formData.publishEnd),
    isPublic: Boolean(formData.isPublic),
  });
};

export const formatArticleDate = (timestamp) => {
  return formatUnixToDateInput(timestamp) || '未設定';
};
