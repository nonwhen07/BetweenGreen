import { useState } from 'react';
import { useForm } from 'react-hook-form';

// constants
import { formatDateInputToUnix, formatUnixToDateInput } from '@/utils/adminBuilderUtils';
import { DEFAULT_COUPON } from '@/utils/adminBuilderUtils';
// services
import { createCoupon, updateCoupon } from '@/services/couponService';
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
    },
    mode: 'onBlur',
  });

  // const { warning } = useToast();

  // state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editCouponId, setEditCouponId] = useState(null);

  // modal lifecycle
  const openCouponModal = async (mode, coupon = null) => {
    setModalMode(mode);

    if (mode === 'create') {
      setEditCouponId(null);
      reset({
        ...DEFAULT_COUPON,
      });
    } else {
      setEditCouponId(coupon.id);

      // 列表 API 回傳的資料 = 編輯需要的完整資料，所以不用再額外查詢 GET 單筆資料
      // 本質上就是： 「拿列表那筆資料 → 做表單格式轉換 → 塞進 RHF」
      reset({
        ...DEFAULT_COUPON,
        ...coupon,
        due_date: formatUnixToDateInput(coupon.due_date),
      });
    }

    setIsModalOpen(true);
  };

  const closeCouponModal = () => {
    setIsModalOpen(false);
    setEditCouponId(null);

    reset({
      ...DEFAULT_COUPON,
    });
  };

  // submit action
  const handleSubmitCoupon = async (formData, onSuccess, onError) => {
    const submitData = {
      ...formData,
      id: editCouponId,
      percent: Number(formData.percent),
      due_date: formatDateInputToUnix(formData.due_date),
      is_enabled: formData.is_enabled ? 1 : 0,

      // RHF這邊自動帶入客製欄位(假設有新增的話)，以 article作為範例： Category / viewerScope / priorityLevel
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
      const errorMessage = extractErrorMessage(error, null, '更新優惠券失敗，請稍後再試。');
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
