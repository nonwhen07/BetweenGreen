import { useCallback } from 'react';

import { useToast } from '@/hooks/useToast';
import { downloadJsonFile } from '@/utils/downloadJsonFile';
import {
  buildProductExportFilename,
  buildProductUpdateExport,
} from '@/utils/product/productExporter';

export const useProductExport = (products = []) => {
  const { success, showError } = useToast();

  const exportAllProducts = useCallback(() => {
    if (products.length === 0) {
      showError('目前沒有可匯出的商品資料');
      return false;
    }

    try {
      const now = new Date();
      const exportData = buildProductUpdateExport(products, now.toISOString());

      downloadJsonFile(exportData, buildProductExportFilename(now));
      success(`已匯出 ${products.length} 筆商品資料`);
      return true;
    } catch {
      showError('商品 JSON 匯出失敗，請稍後再試');
      return false;
    }
  }, [products, showError, success]);

  return { exportAllProducts };
};
