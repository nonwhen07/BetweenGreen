import { useState } from 'react';
import { useForm } from 'react-hook-form';

// constants
import {
  formatDateInputToUnix,
  formatUnixToDateInput,
  formatOptionalDateToUnix,
} from '@/utils/adminBuilderUtils';
import { DEFAULT_ARTICLE } from '@/utils/adminBuilderUtils';
// services
// import { createArticle, updateArticle } from '@/services/articleService';
// services
import { createArticle, updateArticle, getAdminArticle } from '@/services/articleService';
// hooks
import { useToast } from '@/hooks/useToast';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useArticleModal = () => {
  // RHF init
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...DEFAULT_ARTICLE,
      create_at: formatUnixToDateInput(DEFAULT_ARTICLE.create_at),
    },
    mode: 'onBlur',
  });

  const { warning } = useToast();

  // state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editArticleId, setEditArticleId] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  // helper：資料正規化
  const normalizeArticle = (article = {}) => ({
    ...DEFAULT_ARTICLE,
    ...article,
    create_at: formatUnixToDateInput(article.create_at),
    // 客製欄位
    publishStart: formatUnixToDateInput(article.publishStart),
    publishEnd: formatUnixToDateInput(article.publishEnd),
  });

  // modal lifecycle
  const openArticleModal = async (mode, article = null) => {
    setModalMode(mode);

    if (mode === 'create') {
      setEditArticleId(null);
      reset({
        ...DEFAULT_ARTICLE,
        create_at: formatUnixToDateInput(DEFAULT_ARTICLE.create_at),
      });
      setSelectedTags([]);
    } else {
      setEditArticleId(article.id);

      // 關鍵：重新打單篇完整資料
      const res = await getAdminArticle(article.id);
      const fullArticle = res.data;

      // const normalized = normalizeArticle(article);
      const normalized = normalizeArticle(fullArticle);
      reset(normalized);

      setSelectedTags(Array.isArray(normalized.tag) ? normalized.tag : []);
      setValue('tag', Array.isArray(normalized.tag) ? normalized.tag : []);
    }

    setIsModalOpen(true);
  };

  const closeArticleModal = () => {
    setIsModalOpen(false);
    setEditArticleId(null);

    reset({
      ...DEFAULT_ARTICLE,
      create_at: formatUnixToDateInput(DEFAULT_ARTICLE.create_at),
    });

    setSelectedTags([]);
  };

  // tag handler
  const handleTagToggle = (tagValue) => {
    let updatedTags = [];

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
    // setValue('content', updatedTags.join(' | ')); // 給 modal 預覽摘要用
  };

  // submit action
  const handleSubmitArticle = async (formData, onSuccess, onError) => {
    const submitData = {
      ...formData,
      id: editArticleId,
      create_at: formatDateInputToUnix(formData.create_at),
      tag: selectedTags,
      // RHF自動帶入客製欄位：
      // articleCategory / viewerScope / priorityLevel
      // 日期欄位需手動轉unix
      publishStart: formatOptionalDateToUnix(formData.publishStart),
      publishEnd: formatOptionalDateToUnix(formData.publishEnd),
    };

    try {
      if (modalMode === 'create') {
        await createArticle(submitData);
      } else {
        await updateArticle(submitData.id, submitData);
      }

      closeArticleModal();
      onSuccess?.();
      return true;
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '更新文章失敗，請稍後再試。');
      onError?.(errorMessage);
      return false;
    }
  };

  return {
    // modal lifecycle
    isModalOpen,
    modalMode,
    openArticleModal,
    closeArticleModal,

    // tag states
    selectedTags,
    handleTagToggle,

    // submit
    handleSubmitArticle,

    // RHF tools
    register,
    handleSubmit,
    watch,
    errors,
  };
};
