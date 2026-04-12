import axiosAPI from '@/api/axiosAPI';

/**
 * =====================================
 * Coupon Service
 * =====================================
 */

/**
 * ===== Front API =====
 */

// 套用優惠券（前台購物車）
export const applyCoupon = async (couponCode) => {
  const { data } = await axiosAPI.post('/coupon', {
    data: {
      code: couponCode,
    },
  });

  return data;
};

/**
 * ===== Admin API =====
 */

// 後台優惠券列表
export const getAdminCoupons = async (page = 1) => {
  const { data } = await axiosAPI.get('/admin/coupons', {
    params: { page },
  });

  return {
    data: data.coupons,
    pagination: data.pagination,
  };
};

// 取得單一優惠券（⚠️ Hex API 沒有單一 API → 通常不用）
// 👉 可用 getAdminCoupons + find

// 新增優惠券
export const createCoupon = async (couponData) => {
  const { data } = await axiosAPI.post('/admin/coupon', {
    data: couponData,
  });

  return data;
};

// 更新優惠券
export const updateCoupon = async (couponId, couponData) => {
  const { data } = await axiosAPI.put(`/admin/coupon/${couponId}`, {
    data: couponData,
  });

  return data;
};

// 刪除優惠券
export const deleteCoupon = async (couponId) => {
  const { data } = await axiosAPI.delete(`/admin/coupon/${couponId}`);

  return data;
};
