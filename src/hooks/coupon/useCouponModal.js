import { useState } from 'react';
import { useForm } from 'react-hook-form';

// constants
import { DEFAULT_COUPON } from '@/constants/couponConstants';
// services
import { createCoupon, updateCoupon } from '@/services/couponService';
// schemas
import { validateCouponAdminData } from '@/schemas/couponAdminSchema';
// utils
import {
  formatCouponForApi,
  formatCouponForForm,
} from '@/utils/couponFormatter';
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

  // state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editCouponId, setEditCouponId] = useState(null);

  // modal lifecycle
  const openCouponModal = (mode, coupon = null) => {
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
      reset(formatCouponForForm(coupon));
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
    const submitData = formatCouponForApi(formData);
    const { errors: schemaErrors } = validateCouponAdminData(submitData);

    try {
      if (schemaErrors.length > 0) {
        throw new Error(schemaErrors[0]);
      }

      let response;

      if (modalMode === 'create') {
        response = await createCoupon(submitData);
      } else {
        response = await updateCoupon(editCouponId, submitData);
      }

      const savedCoupon = {
        ...submitData,
        id:
          editCouponId ||
          response?.id ||
          response?.data?.id ||
          null,
      };

      closeCouponModal();
      await onSuccess?.({
        coupon: savedCoupon,
        mode: modalMode,
        response,
      });
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
