import { useEffect } from 'react';

// services
import { deleteCoupon } from '@/services/couponService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { useCoupons } from '@/hooks/coupon/useCoupons';
import { useCouponModal } from '@/hooks/coupon/useCouponModal';
import { useDeleteModal } from '@/hooks/useDeleteModal';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

// components
import CouponsTable from '@/components/admin/coupon/CouponsTable';
import CouponModal from '@/components/admin/coupon/CouponModal';
import DeleteModal from '@/components/admin/DeleteModal';

const CouponsPage = () => {
  // hooks init
  const { success, showError } = useToast();
  const { start, stop } = useLoading();
  const { coupons, pageInfo, fetchCoupons } = useCoupons();

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

  // derived values
  const couponCount = coupons?.length || 0;

  // Page actions（CRUD / pagination）
  const handlePageChange = (page = 1) => {
    fetchCoupons({ page });
  };
  const handleUpdateCoupon = handleSubmit((formData) => {
    // submit 真正發生在點按鈕那瞬間 start() 會先觸發，然後才是 handleSubmitProduct 的邏輯
    start();

    return handleSubmitCoupon(
      formData,
      async () => {
        await fetchCoupons({ page: pageInfo.current_page || 1 });
        success(modalMode === 'create' ? '優惠券新增成功！' : '優惠券更新成功！');
        stop();
      },
      (errorMessage) => {
        showError(errorMessage);
        stop();
      },
    );
  });
  const handleDeleteCoupon = async () => {
    if (!deleteTarget?.id) return;
    start();

    try {
      await deleteCoupon(deleteTarget.id);
      // close 要提早，確保無論成功或失敗都會關閉刪除確認視窗
      closeDeleteModal();
      await fetchCoupons({ page: pageInfo.current_page || 1 });
      success('優惠券刪除成功！');
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '刪除優惠券失敗，請稍後再試。');
      showError(errorMessage);
    } finally {
      stop();
    }
  };

  // lifecycle
  useEffect(() => {
    const initCoupons = async () => {
      try {
        await fetchCoupons({ page: 1 });
      } catch (error) {
        const errorMessage = extractErrorMessage(error, null, '取得優惠券列表失敗，請稍後再試。');
        showError(errorMessage);
      }
    };

    initCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="admin-resource-page admin-resource-page--coupon py-1">
        <div className="admin-page-heading">
          <div>
            <h1 className="admin-page-heading__title">優惠券列表</h1>
            <p className="admin-page-heading__description">
              管理優惠券資料、啟用狀態與使用期限
            </p>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h4 className="mb-1">優惠券快速總覽</h4>
              <p className="text-muted small mb-0">本頁共 {couponCount} 筆優惠券資料</p>
            </div>

            <div className="admin-panel__actions d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={() => openCouponModal('create')}
              >
                ＋ 新增優惠券
              </button>
            </div>
          </div>
          <CouponsTable
            coupons={coupons}
            pageInfo={pageInfo}
            handlePageChange={handlePageChange}
            openCouponModal={openCouponModal}
            openDeleteModal={openDeleteModal}
            couponCount={couponCount}
          />
        </div>
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
