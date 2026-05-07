import { useEffect } from 'react';

// services
import { deleteCoupon } from '@/services/couponService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
import { useCoupons } from '@/hooks/product/useCoupons';
import { useCouponModal } from '@/hooks/useCouponModal';
import { useDeleteModal } from '@/hooks/useDeleteModal';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

// components
import CouponsTable from '@/components/admin/CouponsTable';
import CouponModal from '@/components/admin/CouponModal';
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
        success(modalMode === 'create' ? '優惠卷新增成功！' : '優惠卷更新成功！');
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
      success('優惠卷刪除成功！');
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '刪除優惠卷失敗，請稍後再試。');
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
        const errorMessage = extractErrorMessage(error, null, '取得優惠卷列表失敗，請稍後再試。');
        showError(errorMessage);
      }
    };

    initCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="container py-1">
        <div className="admin-panel mt-4">
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
        itemType="優惠卷"
      />
    </>
  );
};

export default CouponsPage;
