import { useState } from 'react';

// services
import { createProduct, updateProduct } from '@/services/productService';
// hooks
import { useAdminActivities } from '@/hooks/activity/useAdminActivities';
import { useToast } from '@/hooks/useToast';
// schemas
import {
  analyzeProductCreateImport,
  analyzeProductUpdateImport,
  parseProductImportJson,
} from '@/schemas/productAdminSchema';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useProductImport = ({ products = [], onCompleted } = {}) => {
  const { success, showError, warning } = useToast();
  const { addActivity } = useAdminActivities();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importMode, setImportMode] = useState('update');
  const [jsonText, setJsonText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [parseError, setParseError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);

  const resetImportState = () => {
    setJsonText('');
    setAnalysis(null);
    setParseError('');
    setIsConfirmed(false);
    setProgress({ current: 0, total: 0 });
    setResults([]);
  };

  const openImportModal = (mode = 'update') => {
    resetImportState();
    setImportMode(mode);
    setIsImportModalOpen(true);
  };

  const closeImportModal = () => {
    if (isProcessing) return;

    setIsImportModalOpen(false);
    resetImportState();
  };

  const handleJsonTextChange = (value) => {
    setJsonText(value);
    setAnalysis(null);
    setParseError('');
    setIsConfirmed(false);
    setProgress({ current: 0, total: 0 });
    setResults([]);
  };

  const analyzeImport = () => {
    try {
      const source = parseProductImportJson(jsonText);
      const nextAnalysis =
        importMode === 'create'
          ? analyzeProductCreateImport(source, products)
          : analyzeProductUpdateImport(source, products);

      setAnalysis(nextAnalysis);
      setParseError('');
      setIsConfirmed(false);
      setResults([]);

      return nextAnalysis;
    } catch (error) {
      setAnalysis(null);
      setParseError(error.message);
      setIsConfirmed(false);
      setResults([]);
      return null;
    }
  };

  const executeImport = async () => {
    if (!analysis?.canExecute || !isConfirmed || isProcessing) return;

    const executableEntries = analysis.entries.filter(
      (entry) =>
        entry.isValid && (importMode === 'create' || entry.hasChanges),
    );

    setIsProcessing(true);
    setResults([]);
    setProgress({ current: 0, total: executableEntries.length });

    const completedResults = [];
    const operationTimestamp = new Date().toISOString();
    const currentProductMap = new Map(
      products.map((product) => [product.id, product]),
    );

    try {
      for (const [index, entry] of executableEntries.entries()) {
        try {
          const currentProduct = currentProductMap.get(entry.id);
          const productData = {
            ...entry.data,
            createdAt:
              importMode === 'create'
                ? operationTimestamp
                : currentProduct?.createdAt ?? entry.data.createdAt ?? null,
            updatedAt:
              importMode === 'create' ? null : operationTimestamp,
          };
          const response =
            importMode === 'create'
              ? await createProduct(productData)
              : await updateProduct(entry.id, productData);

          const createdId =
            response?.product_id || response?.product?.id || response?.id || '';

          completedResults.push({
            key: entry.key,
            id: importMode === 'create' ? createdId : entry.id,
            title: entry.title,
            status: 'success',
            message: importMode === 'create' ? '新增成功' : '更新成功',
          });
        } catch (error) {
          completedResults.push({
            key: entry.key,
            id: entry.id,
            title: entry.title,
            status: 'error',
            message: extractErrorMessage(
              error,
              null,
              importMode === 'create' ? '新增失敗' : '更新失敗',
            ),
          });
        }

        setResults([...completedResults]);
        setProgress({ current: index + 1, total: executableEntries.length });
      }

      const successCount = completedResults.filter(
        (item) => item.status === 'success',
      ).length;
      const errorCount = completedResults.length - successCount;
      const activityStatus =
        errorCount === 0 ? 'success' : successCount > 0 ? 'partial' : 'error';

      try {
        await addActivity({
          module: 'product',
          action: importMode === 'create' ? 'batch-create' : 'batch-update',
          status: activityStatus,
          totalCount: completedResults.length,
          successCount,
          errorCount,
          isReviewed: errorCount === 0,
          details: completedResults.filter((item) => item.status === 'error'),
        });
      } catch {
        warning('批次操作已完成，但操作紀錄保存失敗');
      }

      if (successCount > 0) {
        await onCompleted?.();
      }

      const actionLabel = importMode === 'create' ? '新增' : '更新';

      if (errorCount === 0) {
        success(`JSON 批次${actionLabel}完成，共 ${successCount} 筆商品`);
      } else if (successCount > 0) {
        warning(
          `批次${actionLabel}部分完成：成功 ${successCount} 筆、失敗 ${errorCount} 筆`,
        );
      } else {
        showError(`JSON 批次${actionLabel}失敗，共 ${errorCount} 筆`);
      }
    } catch (error) {
      showError(
        extractErrorMessage(error, null, '批次處理後刷新商品列表失敗'),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isImportModalOpen,
    importMode,
    jsonText,
    analysis,
    parseError,
    isConfirmed,
    isProcessing,
    progress,
    results,

    openImportModal,
    closeImportModal,
    handleJsonTextChange,
    analyzeImport,
    setIsConfirmed,
    executeImport,
  };
};
