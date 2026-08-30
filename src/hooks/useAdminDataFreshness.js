import { useCallback, useEffect, useMemo, useState } from 'react';

// hooks
import { useToast } from '@/hooks/useToast';
// utils
import { getAdminDataFreshness, getAdminDataFreshnessNextDelay } from '@/utils/adminDataFreshness';

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
    setNow(Date.now());
  }, [lastFetchedAt]);

  const freshness = useMemo(() => getAdminDataFreshness(lastFetchedAt, now), [lastFetchedAt, now]);
  const nextCheckDelay = useMemo(
    () => getAdminDataFreshnessNextDelay(lastFetchedAt, now),
    [lastFetchedAt, now],
  );
  const isRefreshing = status === 'loading';
  const hasRefreshError = status === 'error';

  // 一次只安排下一個門檻；進入 stale 後不再建立計時器。
  useEffect(() => {
    if (nextCheckDelay === null) return undefined;

    const timerId = window.setTimeout(() => setNow(Date.now()), Math.max(100, nextCheckDelay + 50));

    return () => window.clearTimeout(timerId);
  }, [nextCheckDelay]);

  // 回到視窗時只重算顯示狀態，不自動呼叫任何 API。
  useEffect(() => {
    const recalculateFreshness = () => setNow(Date.now());
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') recalculateFreshness();
    };

    window.addEventListener('focus', recalculateFreshness);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', recalculateFreshness);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
