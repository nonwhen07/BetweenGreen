import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// constants
import { ARTICLE_PER_PAGE } from '@/constants/articleConstants';
// services
import { deleteArticle } from '@/services/articleService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { usePagination } from '@/hooks/usePagination';
import { useDeleteModal } from '@/hooks/useDeleteModal';
import { useAdminActivities } from '@/hooks/activity/useAdminActivities';
import { useAdminArticles } from '@/hooks/article/useAdminArticles';
import { useArticleExport } from '@/hooks/article/useArticleExport';
import { useArticleHealth } from '@/hooks/article/useArticleHealth';
import { useArticleImport } from '@/hooks/article/useArticleImport';
import { useArticleModal } from '@/hooks/article/useArticleModal';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
// components
import ArticlesTable from '@/components/admin/article/ArticlesTable';
import ArticleHealthToolbar from '@/components/admin/article/ArticleHealthToolbar';
import ArticleImportModal from '@/components/admin/article/ArticleImportModal';
import ArticleModal from '@/components/admin/article/ArticleModal';
import AdminActivityPanel from '@/components/admin/AdminActivityPanel';
import DeleteModal from '@/components/admin/DeleteModal';

const ArticlesPage = () => {
  const { success, showError, warning } = useToast();
  const { start, stop } = useLoading();
  const {
    articles,
    fetchArticles,
    refreshArticles,
    saveArticleToStore,
    removeArticleFromStore,
  } = useAdminArticles();
  const { summary: healthSummary, byArticleId, issueGroups } =
    useArticleHealth(articles);
  const { activities: articleActivities, addActivity, markActivityReviewed } =
    useAdminActivities({ module: 'article' });
  const { exportAllArticles } = useArticleExport(articles);
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedHealthFilter = searchParams.get('health') || 'all';
  const healthFilter = ['all', 'error', 'warning', 'healthy'].includes(
    requestedHealthFilter,
  )
    ? requestedHealthFilter
    : 'all';
  const issueFilter = searchParams.get('issue') || '';

  const {
    isImportModalOpen,
    importMode,
    jsonText: importJsonText,
    analysis: importAnalysis,
    parseError: importParseError,
    isConfirmed: isImportConfirmed,
    isProcessing: isImportProcessing,
    progress: importProgress,
    results: importResults,
    openImportModal,
    closeImportModal,
    handleJsonTextChange,
    analyzeImport,
    setIsConfirmed: setIsImportConfirmed,
    executeImport,
  } = useArticleImport({ articles, onCompleted: refreshArticles });

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

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const articleHealth = byArticleId[article.id];
      const matchHealth =
        healthFilter === 'all' || articleHealth?.status === healthFilter;
      const matchIssue =
        !issueFilter ||
        articleHealth?.issues.some((issue) => issue.code === issueFilter);
      return matchHealth && matchIssue;
    });
  }, [articles, byArticleId, healthFilter, issueFilter]);

  const {
    page,
    totalPages,
    currentItems: currentPageArticles,
    goToPage,
    resetPage,
  } = usePagination({ items: filteredArticles, perPage: ARTICLE_PER_PAGE });

  const handleHealthFilterChange = (nextHealthFilter) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('issue');
    if (nextHealthFilter === 'all') nextSearchParams.delete('health');
    else nextSearchParams.set('health', nextHealthFilter);
    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleIssueFilterChange = (nextIssueFilter) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('health');
    if (nextIssueFilter) nextSearchParams.set('issue', nextIssueFilter);
    else nextSearchParams.delete('issue');
    setSearchParams(nextSearchParams, { replace: true });
  };

  const recordArticleActivity = async ({ action, status, article, message }) => {
    const isSuccess = status === 'success';
    try {
      await addActivity({
        module: 'article',
        action,
        status,
        totalCount: 1,
        successCount: isSuccess ? 1 : 0,
        errorCount: isSuccess ? 0 : 1,
        isReviewed: isSuccess,
        details: isSuccess ? [] : [{
          id: article?.id || '',
          title: article?.title || '未命名文章',
          message,
        }],
      });
    } catch {
      warning('文章操作結果未能保存至操作紀錄');
    }
  };

  const handleUpdateArticle = handleSubmit((formData) => {
    start();
    return handleSubmitArticle(
      formData,
      async ({ article, mode }) => {
        const action = mode === 'create' ? 'create' : 'update';
        try {
          if (article.id) saveArticleToStore(article);
          else await refreshArticles();
          if (mode === 'create') resetPage();
        } catch (error) {
          showError(extractErrorMessage(
            error,
            null,
            '文章已儲存，但同步 Store 失敗，請重新整理頁面。',
          ));
        }

        await recordArticleActivity({ action, status: 'success', article });
        success(mode === 'create' ? '文章新增成功！' : '文章更新成功！');
        stop();
      },
      (errorMessage) => {
        showError(errorMessage);
        stop();
        recordArticleActivity({
          action: modalMode === 'create' ? 'create' : 'update',
          status: 'error',
          article: formData,
          message: errorMessage,
        });
      },
    );
  });

  const handleDeleteArticle = async () => {
    if (!deleteTarget?.id) return;
    start();

    try {
      await deleteArticle(deleteTarget.id);
      closeDeleteModal();
      removeArticleFromStore(deleteTarget.id);
      await recordArticleActivity({
        action: 'delete', status: 'success', article: deleteTarget,
      });
      success('文章刪除成功！');
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        null,
        '刪除文章失敗，請稍後再試。',
      );
      showError(errorMessage);
      await recordArticleActivity({
        action: 'delete', status: 'error', article: deleteTarget, message: errorMessage,
      });
    } finally {
      stop();
    }
  };

  useEffect(() => {
    fetchArticles().catch((error) => {
      showError(extractErrorMessage(error, null, '取得文章列表失敗，請稍後再試。'));
    });
  }, [fetchArticles, showError]);

  useEffect(() => {
    resetPage();
  }, [healthFilter, issueFilter, resetPage]);

  const pageInfo = { current_page: page, total_pages: totalPages };

  return (
    <>
      <div className="admin-resource-page admin-resource-page--article py-1">
        <div className="admin-page-heading">
          <div>
            <h1 className="admin-page-heading__title">文章列表</h1>
            <p className="admin-page-heading__description">
              管理文章內容、發布狀態與前台投放位置
            </p>
          </div>
        </div>

        <ArticleHealthToolbar
          summary={healthSummary}
          issueGroups={issueGroups}
          healthFilter={healthFilter}
          issueFilter={issueFilter}
          onHealthFilterChange={handleHealthFilterChange}
          onIssueFilterChange={handleIssueFilterChange}
        />

        <div className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h4 className="mb-1">文章快速總覽</h4>
              <p className="text-muted small mb-0">
                篩選結果共 {filteredArticles.length} 筆，本頁顯示 {currentPageArticles.length} 筆
              </p>
            </div>

            <div className="admin-panel__actions d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={exportAllArticles}
                disabled={articles.length === 0}
              >
                匯出全部 JSON
              </button>
              <button
                type="button"
                className="btn btn-outline-success px-4"
                onClick={() => openImportModal('create')}
              >
                JSON 批次新增
              </button>
              <button
                type="button"
                className="btn btn-outline-primary px-4"
                onClick={() => openImportModal('update')}
                disabled={articles.length === 0}
              >
                JSON 批次更新
              </button>
              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={() => openArticleModal('create')}
              >
                ＋ 新增文章
              </button>
            </div>
          </div>

          <ArticlesTable
            articles={currentPageArticles}
            pageInfo={pageInfo}
            handlePageChange={goToPage}
            openArticleModal={openArticleModal}
            openDeleteModal={openDeleteModal}
            articleCount={currentPageArticles.length}
            hasArticles={articles.length > 0}
          />
        </div>

        <AdminActivityPanel
          sectionId="article-activity"
          title="文章操作紀錄"
          description="查看單筆 CRUD 與 JSON 批次結果，並確認需要處理的失敗操作"
          activities={articleActivities}
          showFilters
          showDetails
          onReviewedChange={(activityId, isReviewed) =>
            markActivityReviewed(activityId, isReviewed).catch(showError)
          }
        />
      </div>

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

      <ArticleImportModal
        isOpen={isImportModalOpen}
        mode={importMode}
        onClose={closeImportModal}
        jsonText={importJsonText}
        onJsonTextChange={handleJsonTextChange}
        onAnalyze={analyzeImport}
        analysis={importAnalysis}
        parseError={importParseError}
        isConfirmed={isImportConfirmed}
        onConfirmChange={setIsImportConfirmed}
        onExecute={executeImport}
        isProcessing={isImportProcessing}
        progress={importProgress}
        results={importResults}
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
