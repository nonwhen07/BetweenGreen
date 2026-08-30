import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// features
import {
  ensureAdminCoupons,
  fetchAdminCoupons,
  removeAdminCoupon,
  selectAdminCoupons,
  selectAdminCouponsError,
  selectAdminCouponsLastFetchedAt,
  selectAdminCouponsStatus,
  upsertAdminCoupon,
} from '@/features/coupon/couponSlice';

export const useAdminCoupons = () => {
  const dispatch = useDispatch();
  const coupons = useSelector(selectAdminCoupons);
  const status = useSelector(selectAdminCouponsStatus);
  const error = useSelector(selectAdminCouponsError);
  const lastFetchedAt = useSelector(selectAdminCouponsLastFetchedAt);

  const fetchCoupons = useCallback(() => {
    return dispatch(ensureAdminCoupons());
  }, [dispatch]);

  const refreshCoupons = useCallback(({ background = false } = {}) => {
    return dispatch(fetchAdminCoupons({ background })).unwrap();
  }, [dispatch]);

  const saveCouponToStore = useCallback(
    (coupon) => dispatch(upsertAdminCoupon(coupon)),
    [dispatch],
  );

  const removeCouponFromStore = useCallback(
    (couponId) => dispatch(removeAdminCoupon(couponId)),
    [dispatch],
  );

  return {
    coupons,
    status,
    error,
    lastFetchedAt,
    fetchCoupons,
    refreshCoupons,
    saveCouponToStore,
    removeCouponFromStore,
  };
};
