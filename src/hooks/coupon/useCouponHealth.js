import { useMemo } from 'react';

// utils
import { analyzeCouponHealth } from '@/utils/coupon/couponHealthAnalyzer';

export const useCouponHealth = (coupons = []) => {
  return useMemo(() => analyzeCouponHealth(coupons), [coupons]);
};
