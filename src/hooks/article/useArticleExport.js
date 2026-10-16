import { useCallback, useRef, useState } from 'react';

// hooks
import { useToast } from '@/hooks/useToast';
import { getAdminArticle } from '@/services/articleService';
// utils
import { downloadJsonFile } from '@/utils/downloadJsonFile';
import { loadCompleteArticlesForExport } from '@/utils/articleExportLoader';
import {
  buildArticleExportFilename,
  buildArticleUpdateExport,
} from '@/utils/articleExporter';

export const useArticleExport = (articles = []) => {
  const { success, showError } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const exportingRef = useRef(false);

  const exportAllArticles = useCallback(async () => {
    // ref 先上鎖，避免按鈕重新渲染前的連點啟動第二次匯出。
    if (exportingRef.current) return false;
    if (articles.length === 0) {
      showError('目前沒有可匯出的文章資料');
      return false;
    }

    exportingRef.current = true;
    setIsExporting(true);
    try {
      const completeArticles = await loadCompleteArticlesForExport(articles, getAdminArticle);
      const now = new Date();
      const exportData = buildArticleUpdateExport(completeArticles, now.toISOString());

      downloadJsonFile(exportData, buildArticleExportFilename(now));
      success(`已匯出 ${completeArticles.length} 筆完整文章資料`);
      return true;
    } catch (error) {
      showError(error?.message || '文章 JSON 匯出失敗，請稍後再試');
      return false;
    } finally {
      exportingRef.current = false;
      setIsExporting(false);
    }
  }, [articles, showError, success]);

  return { exportAllArticles, isExporting };
};
