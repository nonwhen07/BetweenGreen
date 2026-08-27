import { useCallback } from 'react';

// hooks
import { useToast } from '@/hooks/useToast';
// utils
import { downloadJsonFile } from '@/utils/downloadJsonFile';
import { buildCouponExportFilename, buildCouponUpdateExport } from '@/utils/coupon/couponExporter';

export const useCouponExport = (coupons = []) => {
  const { success, showError } = useToast();

  const exportAllCoupons = useCallback(() => {
    if (coupons.length === 0) {
      showError('目前沒有可匯出的優惠券資料');
      return false;
    }

    try {
      const now = new Date();
      const exportData = buildCouponUpdateExport(coupons, now.toISOString());

      downloadJsonFile(exportData, buildCouponExportFilename(now));
      success(`已匯出 ${coupons.length} 筆優惠券資料`);
      return true;
    } catch {
      showError('優惠券 JSON 匯出失敗，請稍後再試');
      return false;
    }
  }, [coupons, showError, success]);

  return { exportAllCoupons };
};
