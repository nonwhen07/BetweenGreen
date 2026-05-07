import { useState } from 'react';
import { useForm } from 'react-hook-form';

// constants
import {
  formatDateInputToUnix,
  formatUnixToDateInput,
  formatOptionalDateToUnix,
} from '@/utils/adminBuilderUtils';
import { DEFAULT_COUPON } from '@/utils/adminBuilderUtils';
// services
import { createCoupon, updateCoupon, getAdminCoupon } from '@/services/couponService';
// hooks
// import { useToast } from '@/hooks/useToast';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useCouponModal = () => {
  // RHF init
  const {
    register,
    handleSubmit,
    reset,
    // setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...DEFAULT_COUPON,
      // create_at: formatUnixToDateInput(DEFAULT_COUPON.create_at), // api沒有該欄位，有需要可以客製化
    },
    mode: 'onBlur',
  });

  // const { warning } = useToast();

  // state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editCouponId, setEditCouponId] = useState(null);

  // helper：資料正規化
  const normalizeArticle = (coupon = {}) => ({
    ...DEFAULT_COUPON,
    ...coupon,
    create_at: formatUnixToDateInput(coupon.create_at),
    // 客製欄位
    publishStart: formatUnixToDateInput(coupon.publishStart),
    publishEnd: formatUnixToDateInput(coupon.publishEnd),
  });

  // modal lifecycle
  const openCouponModal = async (mode, coupon = null) => {
    setModalMode(mode);

    if (mode === 'create') {
      setEditCouponId(null);
      reset({
        ...DEFAULT_COUPON,
        // create_at: formatUnixToDateInput(DEFAULT_COUPON.create_at),
      });
    } else {
      setEditCouponId(coupon.id);

      // 關鍵：重新打單篇完整資料
      const res = await getAdminCoupon(coupon.id); // 這邊有點問題由於api只有列表(getAdminCoupons)，要怎麼打開單筆資料?
      const fullCoupon = res.data;

      const normalized = normalizeArticle(fullCoupon);
      reset(normalized);
    }

    setIsModalOpen(true);
  };

  const closeCouponModal = () => {
    setIsModalOpen(false);
    setEditCouponId(null);

    reset({
      ...DEFAULT_COUPON,
      // create_at: formatUnixToDateInput(DEFAULT_COUPON.create_at),
    });
  };

  // submit action
  const handleSubmitCoupon = async (formData, onSuccess, onError) => {
    const submitData = {
      ...formData,
      id: editCouponId,
      create_at: formatDateInputToUnix(formData.create_at),

      // RHF這邊自動帶入客製欄位(假設有新增的話)，以 article作為範例： Category / viewerScope / priorityLevel

      // 日期欄位需手動轉unix
      publishStart: formatOptionalDateToUnix(formData.publishStart),
      publishEnd: formatOptionalDateToUnix(formData.publishEnd),
    };

    try {
      if (modalMode === 'create') {
        await createCoupon(submitData);
      } else {
        await updateCoupon(submitData.id, submitData);
      }

      closeCouponModal();
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
    openCouponModal,
    closeCouponModal,

    // submit
    handleSubmitCoupon,

    // RHF tools
    register,
    handleSubmit,
    watch,
    errors,
  };
};
