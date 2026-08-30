import { useCallback, useEffect, useMemo, useState } from 'react';

// hooks
import { useToast } from '@/hooks/useToast';
// utils
import { getAdminDataFreshness } from '@/utils/adminDataFreshness';

export const useAdminDataFreshness = ({
  resourceLabel,
  lastFetchedAt,
  status,
  refreshData,
  isInteractionLocked = false,
}) => {
  const { success, showError } = useToast();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    setNow(Date.now());
  }, [lastFetchedAt]);

  const freshness = useMemo(() => getAdminDataFreshness(lastFetchedAt, now), [lastFetchedAt, now]);
  const isRefreshing = status === 'loading';
  const hasRefreshError = status === 'error';

  const refreshCurrentData = useCallback(async () => {
    if (isInteractionLocked || isRefreshing) return;

    try {
      await refreshData({ background: true });
      success(`${resourceLabel}資料已更新`);
    } catch {
      showError(`${resourceLabel}資料更新失敗，畫面仍保留上次成功載入的內容。`);
    }
  }, [isInteractionLocked, isRefreshing, refreshData, resourceLabel, showError, success]);

  return {
    ...freshness,
    hasRefreshError,
    isInteractionLocked,
    isRefreshing,
    refreshCurrentData,
  };
};
