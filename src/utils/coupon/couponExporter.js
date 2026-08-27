import { COUPON_ADMIN_FIELD_KEYS } from '@/schemas/couponAdminSchema';

const pickExportableCouponFields = (coupon) => {
  return COUPON_ADMIN_FIELD_KEYS.reduce((result, field) => {
    if (coupon[field] !== undefined) result[field] = coupon[field];
    return result;
  }, {});
};

export const buildCouponUpdateExport = (coupons, exportedAt) => {
  const couponMap = coupons.reduce((result, coupon) => {
    if (!coupon?.id) return result;

    result[coupon.id] = pickExportableCouponFields(coupon);
    return result;
  }, {});

  return {
    meta: {
      type: 'coupon',
      mode: 'update',
      exportedAt,
      total: Object.keys(couponMap).length,
    },
    coupons: couponMap,
  };
};

export const buildCouponExportFilename = (date = new Date()) => {
  const localDate = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

  return `between-green-coupons-${localDate}.json`;
};
