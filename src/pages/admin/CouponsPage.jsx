import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// constants
import { COUPON_PER_PAGE } from '@/constants/couponConstants';
// services
import { deleteCoupon } from '@/services/couponService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { usePagination } from '@/hooks/usePagination';
import { useAdminActivities } from '@/hooks/activity/useAdminActivities';
import { useAdminCoupons } from '@/hooks/coupon/useAdminCoupons';
import { useCouponExport } from '@/hooks/coupon/useCouponExport';
import { useCouponHealth } from '@/hooks/coupon/useCouponHealth';
import { useCouponImport } from '@/hooks/coupon/useCouponImport';
import { useCouponModal } from '@/hooks/coupon/useCouponModal';
import { useDeleteModal } from '@/hooks/useDeleteModal';
import { useAdminDataFreshness } from '@/hooks/useAdminDataFreshness';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

// components
import CouponsTable from '@/components/admin/coupon/CouponsTable';
import CouponHealthToolbar from '@/components/admin/coupon/CouponHealthToolbar';
import CouponImportModal from '@/components/admin/coupon/CouponImportModal';
import CouponModal from '@/components/admin/coupon/CouponModal';
import AdminActivityPanel from '@/components/admin/AdminActivityPanel';
import DeleteModal from '@/components/admin/DeleteModal';
import AdminDataFreshness from '@/components/admin/AdminDataFreshness';
import BrandPagination from '@/components/shared/BrandPagination';

const CouponsPage = () => {
  // hooks init
  const { success, showError, warning } = useToast();
  const { start, stop } = useLoading();
  const {
    coupons,
    status: couponStatus,
    lastFetchedAt: couponLastFetchedAt,
    fetchCoupons,
    refreshCoupons,
    saveCouponToStore,
    removeCouponFromStore,
  } = useAdminCoupons();
  const { summary: healthSummary, byCouponId, issueGroups } = useCouponHealth(coupons);
  const {
    activities: couponActivities,
    addActivity,
    markActivityReviewed,
  } = useAdminActivities({ module: 'coupon', reviewedLimit: 5 });
  const { exportAllCoupons } = useCouponExport(coupons);
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedHealthFilter = searchParams.get('health') || 'all';
  const healthFilter = ['all', 'error', 'warning', 'healthy'].includes(requestedHealthFilter)
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
  } = useCouponImport({
    coupons,
    onCompleted: refreshCoupons,
  });

  const {
    isModalOpen: isCouponModalOpen,
    modalMode,
    openCouponModal,
    closeCouponModal,

    handleSubmitCoupon,

    register,
    handleSubmit,
    watch,
    errors,
  } = useCouponModal();
  const {
    isOpen: isDeleteModalOpen,
    targetItem: deleteTarget,
    openDeleteModal,
    closeDeleteModal,
  } = useDeleteModal();
  const couponFreshness = useAdminDataFreshness({
    resourceLabel: '優惠券',
    lastFetchedAt: couponLastFetchedAt,
    status: couponStatus,
    refreshData: refreshCoupons,
    isInteractionLocked: isCouponModalOpen || isImportModalOpen || isDeleteModalOpen,
  });

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const couponHealth = byCouponId[coupon.id];
      const matchHealth = healthFilter === 'all' || couponHealth?.status === healthFilter;
      const matchIssue =
        !issueFilter || couponHealth?.issues.some((issue) => issue.code === issueFilter);

      return matchHealth && matchIssue;
    });
  }, [byCouponId, coupons, healthFilter, issueFilter]);

  const {
    page,
    totalPages,
    currentItems: currentPageCoupons,
    goToPage,
    resetPage,
  } = usePagination({
    items: filteredCoupons,
    perPage: COUPON_PER_PAGE,
  });

  // derived values
  const couponCount = currentPageCoupons.length;
  const couponTotalCount = filteredCoupons.length;
  // Page actions（CRUD / pagination）
  const handleHealthFilterChange = (nextHealthFilter) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.delete('issue');

    if (nextHealthFilter === 'all') {
      nextSearchParams.delete('health');
    } else {
      nextSearchParams.set('health', nextHealthFilter);
    }

    setSearchParams(nextSearchParams, { replace: true });
  };
  const handleIssueFilterChange = (nextIssueFilter) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.delete('health');

    if (nextIssueFilter) {
      nextSearchParams.set('issue', nextIssueFilter);
    } else {
      nextSearchParams.delete('issue');
    }

    setSearchParams(nextSearchParams, { replace: true });
  };
  const recordCouponActivity = async ({ action, status, coupon, message }) => {
    const isSuccess = status === 'success';

    try {
      await addActivity({
        module: 'coupon',
        action,
        status,
        totalCount: 1,
        successCount: isSuccess ? 1 : 0,
        errorCount: isSuccess ? 0 : 1,
        isReviewed: isSuccess,
        details: isSuccess
          ? []
          : [
              {
                id: coupon?.id || '',
                title: coupon?.title || '未命名優惠券',
                message,
              },
            ],
      });
    } catch {
      warning('優惠券操作結果未能保存至操作紀錄');
    }
  };
  const handleUpdateCoupon = handleSubmit(async (formData) => {
    start();
    const attemptedMode = modalMode;

    try {
      const { coupon, mode } = await handleSubmitCoupon(formData);
      const action = mode === 'create' ? 'create' : 'update';
      let isStoreSynchronized = true;

      try {
        if (coupon.id) {
          saveCouponToStore(coupon);
        } else {
          // Hex API 若未回傳新增 ID，重抓一次以取得後端產生的完整資料。
          await refreshCoupons();
        }

        if (mode === 'create') resetPage();
      } catch (error) {
        isStoreSynchronized = false;
        showError(
          extractErrorMessage(error, null, '優惠券已儲存，但同步 Store 失敗，請重新整理頁面。'),
        );
      }

      await recordCouponActivity({ action, status: 'success', coupon });
      if (isStoreSynchronized) {
        success(mode === 'create' ? '優惠券新增成功！' : '優惠券更新成功！');
      }
    } catch (error) {
      const errorMessage = error?.response
        ? extractErrorMessage(error, null, '更新優惠券失敗，請稍後再試。')
        : error?.message || '更新優惠券失敗，請稍後再試。';

      showError(errorMessage);
      await recordCouponActivity({
        action: attemptedMode === 'create' ? 'create' : 'update',
        status: 'error',
        coupon: formData,
        message: errorMessage,
      });
    } finally {
      stop();
    }
  });
  const handleDeleteCoupon = async () => {
    if (!deleteTarget?.id) return;
    start();

    try {
      await deleteCoupon(deleteTarget.id);
      // close 要提早，確保無論成功或失敗都會關閉刪除確認視窗
      closeDeleteModal();
      removeCouponFromStore(deleteTarget.id);
      await recordCouponActivity({
        action: 'delete',
        status: 'success',
        coupon: deleteTarget,
      });
      success('優惠券刪除成功！');
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '刪除優惠券失敗，請稍後再試。');
      showError(errorMessage);
      await recordCouponActivity({
        action: 'delete',
        status: 'error',
        coupon: deleteTarget,
        message: errorMessage,
      });
    } finally {
      stop();
    }
  };

  // lifecycle
  useEffect(() => {
    const initCoupons = async () => {
      try {
        await fetchCoupons();
      } catch (error) {
        const errorMessage = extractErrorMessage(error, null, '取得優惠券列表失敗，請稍後再試。');
        showError(errorMessage);
      }
    };

    initCoupons();
  }, [fetchCoupons, showError]);

  useEffect(() => {
    resetPage();
  }, [healthFilter, issueFilter, resetPage]);

  return (
    <>
      <div className="admin-resource-page admin-resource-page--coupon py-1">
        <div className="admin-page-heading">
          <div>
            <h1 className="admin-page-heading__title">優惠券列表</h1>
            <p className="admin-page-heading__description">管理優惠券資料、啟用狀態與使用期限</p>
          </div>
        </div>

        <AdminDataFreshness {...couponFreshness} onRefresh={couponFreshness.refreshCurrentData} />

        <CouponHealthToolbar
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
              <h4 className="mb-1">優惠券快速總覽</h4>
              <p className="text-muted small mb-0">
                篩選結果共 {couponTotalCount} 筆，本頁顯示 {couponCount} 筆
              </p>
            </div>

            <div className="admin-panel__actions">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={exportAllCoupons}
                disabled={coupons.length === 0}
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
                disabled={coupons.length === 0}
              >
                JSON 批次更新
              </button>

              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={() => openCouponModal('create')}
              >
                ＋ 新增優惠券
              </button>
            </div>
          </div>
          <div className="admin-panel__body">
            <CouponsTable
              coupons={currentPageCoupons}
              openCouponModal={openCouponModal}
              openDeleteModal={openDeleteModal}
              couponCount={couponCount}
              hasCoupons={coupons.length > 0}
            />
          </div>

          {totalPages > 1 && (
            <div className="admin-panel__footer">
              <BrandPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={goToPage}
                ariaLabel="優惠券分頁導覽"
              />
            </div>
          )}
        </div>

        <AdminActivityPanel
          sectionId="coupon-activity"
          title="優惠券操作紀錄"
          description="查看單筆 CRUD 與 JSON 批次結果，並確認需要處理的失敗操作"
          activities={couponActivities}
          showFilters
          showDetails
          onReviewedChange={(activityId, isReviewed) =>
            markActivityReviewed(activityId, isReviewed).catch(showError)
          }
        />
      </div>

      {/* Modals */}
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={closeCouponModal}
        modalMode={modalMode}
        onConfirm={handleUpdateCoupon}
        register={register}
        watch={watch}
        errors={errors}
      />

      <CouponImportModal
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
        onConfirm={handleDeleteCoupon}
        itemName={deleteTarget?.title}
        itemType="優惠券"
      />
    </>
  );
};

// TODO:
// 1. Coupon 後面預計補：
// - start_date（優惠開始日）
// - couponType（seasonal / new-user / event...）
// - campaignTag（前台活動標籤）
// - viewerScope（路人 / 會員 / 員工）
// - minimumAmount（最低消費門檻）
//
// 2. Coupon 之後需要和 cart / order 串接：
// - cart 套用 applyCoupon()
// - cart summary 顯示優惠後價格
// - order 顯示 coupon 資訊
// - order 顯示 discount amount
//
// 3. 運費邏輯目前先獨立，不和 coupon 綁死：
// - shippingFee
// - free shipping threshold
//
// 4. 後面可能補：
// - expired 狀態 badge
// - coupon 排序 / 篩選
// - dashboard 統計
//
// 5. 等 CRUD 穩定後再整理 Admin UI System
// （admin-panel / admin-form-section / toolbar / filters）
//
// 6. 後面可考慮補：
// - coupon JSON 匯入 / 匯出
// - 支援 JSON 字串 / 物件格式
// - 不合規 schema 顯示 warning
// - 未來可給 Codex / AI 接手批量建立活動資料

export default CouponsPage;
