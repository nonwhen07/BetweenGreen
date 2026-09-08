import { useCallback, useMemo, useRef, useState } from 'react';

// utils
import { downloadJsonFile } from '@/utils/downloadJsonFile';
import {
  buildOrderArchiveExport,
  buildOrderExportFilename,
  filterOrdersByExportPeriod,
  getOrderExportPeriod,
  getTaipeiCalendarSelection,
  ORDER_EXPORT_PERIOD_TYPES,
} from '@/utils/order/orderExporter';

export const useOrderExport = ({ orders, refreshOrders }) => {
  const defaultSelection = useMemo(() => getTaipeiCalendarSelection(), []);
  const [isOpen, setIsOpen] = useState(false);
  const [periodType, setPeriodType] = useState(ORDER_EXPORT_PERIOD_TYPES.MONTH);
  const [month, setMonth] = useState(defaultSelection.month);
  const [year, setYear] = useState(defaultSelection.year);
  const [quarter, setQuarter] = useState(defaultSelection.quarter);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  const period = useMemo(() => {
    try {
      return getOrderExportPeriod({ periodType, month, year, quarter });
    } catch {
      return null;
    }
  }, [month, periodType, quarter, year]);
  const previewCount = useMemo(() => {
    return period ? filterOrdersByExportPeriod(orders, period).length : 0;
  }, [orders, period]);

  const changePeriodType = useCallback((value) => {
    setPeriodType(value);
    setIsConfirmed(false);
  }, []);
  const changeMonth = useCallback((value) => {
    setMonth(value);
    setIsConfirmed(false);
  }, []);
  const changeYear = useCallback((value) => {
    setYear(value);
    setIsConfirmed(false);
  }, []);
  const changeQuarter = useCallback((value) => {
    setQuarter(value);
    setIsConfirmed(false);
  }, []);

  const openExportModal = useCallback(() => {
    setIsConfirmed(false);
    setIsOpen(true);
  }, []);
  const closeExportModal = useCallback(() => {
    if (isProcessing) return;
    setIsConfirmed(false);
    setIsOpen(false);
  }, [isProcessing]);

  const executeExport = useCallback(async () => {
    if (!period || !isConfirmed || processingRef.current) return null;

    processingRef.current = true;
    setIsProcessing(true);

    try {
      const refreshedOrders = await refreshOrders();
      const exportOrders = filterOrdersByExportPeriod(refreshedOrders, period);

      if (exportOrders.length === 0) {
        return { status: 'empty', period };
      }

      const exportedAt = new Date().toISOString();
      const exportData = buildOrderArchiveExport(exportOrders, period, exportedAt);

      downloadJsonFile(exportData, buildOrderExportFilename(period));
      setIsConfirmed(false);
      setIsOpen(false);

      return {
        status: 'success',
        period,
        total: exportOrders.length,
      };
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [isConfirmed, period, refreshOrders]);

  return {
    isOpen,
    periodType,
    month,
    year,
    quarter,
    period,
    previewCount,
    isConfirmed,
    isProcessing,
    canExport: Boolean(period && isConfirmed && !isProcessing),
    openExportModal,
    closeExportModal,
    changePeriodType,
    changeMonth,
    changeYear,
    changeQuarter,
    setIsConfirmed,
    executeExport,
  };
};
