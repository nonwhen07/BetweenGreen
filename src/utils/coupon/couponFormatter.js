import { DEFAULT_COUPON } from '@/constants/couponConstants';
import { normalizeCouponAdminData } from '@/schemas/couponAdminSchema';
import {
  formatDateInputToUnix,
  formatUnixToDateInput,
} from '@/utils/adminBuilderUtils';

export const formatCouponForForm = (coupon = {}) => {
  return {
    ...DEFAULT_COUPON,
    ...coupon,
    due_date: formatUnixToDateInput(coupon.due_date),
    is_enabled:
      coupon.is_enabled === 1 ||
      coupon.is_enabled === true ||
      coupon.is_enabled === '1',
  };
};

export const formatCouponForApi = (formData = {}) => {
  return normalizeCouponAdminData({
    ...formData,
    due_date: formatDateInputToUnix(formData.due_date),
    is_enabled: formData.is_enabled ? 1 : 0,
  });
};

export const formatCouponDueDate = (timestamp) => {
  return formatUnixToDateInput(timestamp) || '未設定';
};
