import { useState } from 'react';
import { useForm } from 'react-hook-form';

// constants
import { DEFAULT_ARTICLE } from '@/constants/articleConstants';
// services
import {
  createArticle,
  getAdminArticle,
  updateArticle,
} from '@/services/articleService';
// hooks
import { useToast } from '@/hooks/useToast';
// schemas
import { validateArticleAdminData } from '@/schemas/articleAdminSchema';
// utils
import {
  formatArticleForApi,
  formatArticleForForm,
} from '@/utils/articleFormatter';
import { extractErrorMessage } from '@/utils/errorHandler';

export const useArticleModal = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: formatArticleForForm(DEFAULT_ARTICLE),
    mode: 'onBlur',
  });
  const { warning, showError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editArticleId, setEditArticleId] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const openArticleModal = async (mode, article = null) => {
    setModalMode(mode);

    if (mode === 'create') {
      setEditArticleId(null);
      reset(formatArticleForForm({
        ...DEFAULT_ARTICLE,
        create_at: Math.floor(Date.now() / 1000),
      }));
      setSelectedTags([]);
      setIsModalOpen(true);
      return true;
    }

    if (!article?.id) return false;

    try {
      const response = await getAdminArticle(article.id);
      const normalized = formatArticleForForm(response.data);

      setEditArticleId(article.id);
      reset(normalized);
      setSelectedTags(normalized.tag);
      setValue('tag', normalized.tag);
      setIsModalOpen(true);
      return true;
    } catch (error) {
      showError(
        extractErrorMessage(error, null, '取得完整文章內容失敗，請稍後再試。'),
      );
      return false;
    }
  };

  const closeArticleModal = () => {
    setIsModalOpen(false);
    setEditArticleId(null);
    reset(formatArticleForForm(DEFAULT_ARTICLE));
    setSelectedTags([]);
  };

  const handleTagToggle = (tagValue) => {
    let updatedTags;

    if (selectedTags.includes(tagValue)) {
      updatedTags = selectedTags.filter((tag) => tag !== tagValue);
    } else {
      if (selectedTags.length >= 4) {
        warning('文章標籤最多選擇 4 個');
        return;
      }
      updatedTags = [...selectedTags, tagValue];
    }

    setSelectedTags(updatedTags);
    setValue('tag', updatedTags);
  };

  const handleSubmitArticle = async (formData) => {
    const submitData = formatArticleForApi(formData, selectedTags);
    const validation = validateArticleAdminData(submitData);

    if (validation.errors.length > 0) {
      throw new Error(validation.errors[0]);
    }

    const completedMode = modalMode;
    const response = completedMode === 'create'
        ? await createArticle(submitData)
        : await updateArticle(editArticleId, submitData);
    const savedArticle = {
      ...submitData,
      id:
        editArticleId ||
        response?.article_id ||
        response?.article?.id ||
        response?.id ||
        null,
    };

    closeArticleModal();

    return { article: savedArticle, mode: completedMode, response };
  };

  return {
    isModalOpen,
    modalMode,
    openArticleModal,
    closeArticleModal,
    selectedTags,
    handleTagToggle,
    handleSubmitArticle,
    register,
    handleSubmit,
    watch,
    errors,
  };
};
