import { useState } from 'react';

// services
import { updateProduct } from '@/services/productService';
// hooks
import { useToast } from '@/hooks/useToast';
// schemas
import {
  analyzeProductUpdateImport,
  parseProductImportJson,
} from '@/schemas/productAdminSchema';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

export const useProductImport = ({ products = [], onUpdated } = {}) => {
  const { success, showError, warning } = useToast();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [parseError, setParseError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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

  const openImportModal = () => {
    resetImportState();
    setIsImportModalOpen(true);
  };

  const closeImportModal = () => {
    if (isUpdating) return;

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
      const nextAnalysis = analyzeProductUpdateImport(source, products);

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

  const executeUpdate = async () => {
    if (!analysis?.canUpdate || !isConfirmed || isUpdating) return;

    const updateEntries = analysis.entries.filter(
      (entry) => entry.isValid && entry.hasChanges,
    );

    setIsUpdating(true);
    setResults([]);
    setProgress({ current: 0, total: updateEntries.length });

    const completedResults = [];

    try {
      for (const [index, entry] of updateEntries.entries()) {
        try {
          await updateProduct(entry.id, entry.data);

          completedResults.push({
            id: entry.id,
            title: entry.title,
            status: 'success',
            message: '更新成功',
          });
        } catch (error) {
          completedResults.push({
            id: entry.id,
            title: entry.title,
            status: 'error',
            message: extractErrorMessage(error, null, '更新失敗'),
          });
        }

        setResults([...completedResults]);
        setProgress({ current: index + 1, total: updateEntries.length });
      }

      const successCount = completedResults.filter(
        (item) => item.status === 'success',
      ).length;
      const errorCount = completedResults.length - successCount;

      if (successCount > 0) {
        await onUpdated?.();
      }

      if (errorCount === 0) {
        success(`JSON 批次更新完成，共 ${successCount} 筆商品`);
      } else if (successCount > 0) {
        warning(
          `批次更新部分完成：成功 ${successCount} 筆、失敗 ${errorCount} 筆`,
        );
      } else {
        showError(`JSON 批次更新失敗，共 ${errorCount} 筆`);
      }
    } catch (error) {
      showError(extractErrorMessage(error, null, '批次更新後刷新商品列表失敗'));
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isImportModalOpen,
    jsonText,
    analysis,
    parseError,
    isConfirmed,
    isUpdating,
    progress,
    results,

    openImportModal,
    closeImportModal,
    handleJsonTextChange,
    analyzeImport,
    setIsConfirmed,
    executeUpdate,
  };
};
