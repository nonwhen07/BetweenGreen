import { useCallback } from 'react';

// hooks
import { useToast } from '@/hooks/useToast';
// utils
import { downloadJsonFile } from '@/utils/downloadJsonFile';
import {
  buildArticleExportFilename,
  buildArticleUpdateExport,
} from '@/utils/articleExporter';

export const useArticleExport = (articles = []) => {
  const { success, showError } = useToast();

  const exportAllArticles = useCallback(() => {
    if (articles.length === 0) {
      showError('目前沒有可匯出的文章資料');
      return false;
    }

    try {
      const now = new Date();
      const exportData = buildArticleUpdateExport(articles, now.toISOString());

      downloadJsonFile(exportData, buildArticleExportFilename(now));
      success(`已匯出 ${articles.length} 筆文章資料`);
      return true;
    } catch {
      showError('文章 JSON 匯出失敗，請稍後再試');
      return false;
    }
  }, [articles, showError, success]);

  return { exportAllArticles };
};
