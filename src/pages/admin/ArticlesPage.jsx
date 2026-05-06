import { useEffect } from 'react';

// services
import { deleteArticle } from '@/services/articleService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { useArticles } from '@/hooks/article/useArticles';
import { useArticleModal } from '@/hooks/useArticleModal';
import { useDeleteModal } from '@/hooks/useDeleteModal';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
// components
import ArticlesTable from '@/components/admin/ArticlesTable';
import ArticleModal from '@/components/admin/ArticleModal';
import DeleteModal from '@/components/admin/DeleteModal';

const ArticlesPage = () => {
  // hooks init
  const { success, showError } = useToast();
  const { start, stop } = useLoading();
  const { articles, pageInfo, fetchArticles } = useArticles({ isAdmin: true });
  const {
    isModalOpen: isArticleModalOpen,
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
  } = useArticleModal();
  const {
    isOpen: isDeleteModalOpen,
    targetItem: deleteTarget,
    openDeleteModal,
    closeDeleteModal,
  } = useDeleteModal();

  // derived values
  const articleCount = articles?.length || 0;

  // Page actions（CRUD / pagination）
  const handlePageChange = (page = 1) => {
    fetchArticles({ page });
  };
  const handleUpdateArticle = handleSubmit((formData) => {
    // submit 真正發生在點按鈕那瞬間 start() 會先觸發，然後才是 handleSubmitArticle 的邏輯
    start();

    return handleSubmitArticle(
      formData,
      async () => {
        await fetchArticles({ page: pageInfo.current_page || 1 });
        success(modalMode === 'create' ? '文章新增成功！' : '文章更新成功！'); // 先統一處理，後面分類型調整名稱
        stop();
      },
      (errorMessage) => {
        showError(errorMessage);
        stop();
      },
    );
  });
  const handleDeleteArticle = async () => {
    if (!deleteTarget?.id) return;
    start();

    try {
      await deleteArticle(deleteTarget.id);
      // close 要提早，確保無論成功或失敗都會關閉刪除確認視窗
      closeDeleteModal();
      await fetchArticles({ page: pageInfo.current_page || 1 });
      success('Article刪除成功！');
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '刪除Article失敗，請稍後再試。');
      showError(errorMessage);
    } finally {
      stop();
    }
  };

  // lifecycle
  useEffect(() => {
    // useEffect getArticles 初始載入Article資料，先page=1，category先不指定
    const initArticles = async () => {
      try {
        await fetchArticles({ page: 1 });
      } catch (error) {
        const errorMessage = extractErrorMessage(error, null, '取得Article列表失敗，請稍後再試。');
        showError(errorMessage);
      }
    };

    initArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="container py-1">
        <h2 className="mb-0">Article列表</h2>
        <ArticlesTable
          articles={articles}
          pageInfo={pageInfo}
          handlePageChange={handlePageChange}
          openArticleModal={openArticleModal}
          openDeleteModal={openDeleteModal}
          articleCount={articleCount}
        />
      </div>

      {/* Modals */}
      <ArticleModal
        isOpen={isArticleModalOpen}
        onClose={closeArticleModal}
        modalMode={modalMode}
        onConfirm={handleUpdateArticle}
        selectedTags={selectedTags}
        handleTagToggle={handleTagToggle}
        register={register}
        watch={watch}
        errors={errors}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteArticle}
        itemName={deleteTarget?.title}
        itemType="文章"
      />
    </>
  );
};

export default ArticlesPage;
