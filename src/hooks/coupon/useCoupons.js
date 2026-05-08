import { useState, useCallback } from 'react';

// services
import { getAdminCoupons } from '@/services/couponService';
// hooks
import { useToast } from '@/hooks/useToast';
import { useLoading } from '@/hooks/useLoading';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useCoupons = () => {
  const { showError } = useToast();
  const { start, stop } = useLoading();

  const [coupons, setCoupons] = useState([]);
  const [pageInfo, setPageInfo] = useState({});

  // 統一入口
  const fetchCoupons = useCallback(
    async (params) => {
      start();

      try {
        // const res = isAdmin ? await getAdminCoupons(params) : await getCoupons(params);
        const res = await getAdminCoupons(params.page || 1);
        setCoupons(res.data || []);
        setPageInfo(res.pagination || {});
      } catch (error) {
        showError(extractErrorMessage(error));
      } finally {
        stop();
      }
    },
    [showError, start, stop],
  );

  return {
    coupons,
    pageInfo,
    fetchCoupons,
  };
};
