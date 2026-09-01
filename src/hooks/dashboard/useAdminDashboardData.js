import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from 'react-redux';

import { useAdminArticles } from '@/hooks/article/useAdminArticles';
import { useArticleHealth } from '@/hooks/article/useArticleHealth';
import { useAdminCoupons } from '@/hooks/coupon/useAdminCoupons';
import { useCouponHealth } from '@/hooks/coupon/useCouponHealth';
import { useAdminOrders } from '@/hooks/order/useAdminOrders';
import { useOrderHealth } from '@/hooks/order/useOrderHealth';
import { useAdminProducts } from '@/hooks/product/useAdminProducts';
import { useProductHealth } from '@/hooks/product/useProductHealth';
import {
  getAdminDataFreshness,
  getAdminDataFreshnessNextDelay,
  getAdminFreshnessReferenceNow,
  getAdminModuleRefreshMode,
} from '@/utils/adminDataFreshness';

const DASHBOARD_MODULES = [
  { key: 'product', label: '商品' },
  { key: 'coupon', label: '優惠券' },
  { key: 'article', label: '文章' },
  { key: 'order', label: '訂單' },
];

export const useAdminDashboardData = () => {
  const store = useStore();
  const productData = useAdminProducts();
  const couponData = useAdminCoupons();
  const articleData = useAdminArticles();
  const orderData = useAdminOrders();
  const [dashboardNow, setDashboardNow] = useState(() => Date.now());

  const productHealth = useProductHealth(productData.products);
  const couponHealth = useCouponHealth(couponData.coupons);
  const articleHealth = useArticleHealth(articleData.articles);
  const orderHealth = useOrderHealth(orderData.orders);

  const modules = useMemo(
    () => ({
      product: { ...productData, health: productHealth },
      coupon: { ...couponData, health: couponHealth },
      article: { ...articleData, health: articleHealth },
      order: { ...orderData, health: orderHealth },
    }),
    [
      articleData,
      articleHealth,
      couponData,
      couponHealth,
      orderData,
      orderHealth,
      productData,
      productHealth,
    ],
  );

  const moduleFreshness = useMemo(() => {
    return DASHBOARD_MODULES.reduce((result, module) => {
      const lastFetchedAt = modules[module.key].lastFetchedAt;
      const referenceNow = getAdminFreshnessReferenceNow(lastFetchedAt, dashboardNow);

      result[module.key] = getAdminDataFreshness(lastFetchedAt, referenceNow);
      return result;
    }, {});
  }, [dashboardNow, modules]);

  const nextCheckDelay = useMemo(() => {
    const delays = DASHBOARD_MODULES.map((module) => {
      const lastFetchedAt = modules[module.key].lastFetchedAt;
      const referenceNow = getAdminFreshnessReferenceNow(lastFetchedAt, dashboardNow);

      return getAdminDataFreshnessNextDelay(lastFetchedAt, referenceNow);
    }).filter((delay) => delay !== null);

    return delays.length > 0 ? Math.min(...delays) : null;
  }, [dashboardNow, modules]);

  // Dashboard 也只保留一個計時器，安排四個模組之中最近的下一個門檻。
  useEffect(() => {
    if (nextCheckDelay === null) return undefined;

    const timerId = window.setTimeout(
      () => setDashboardNow(Date.now()),
      Math.max(100, nextCheckDelay + 50),
    );

    return () => window.clearTimeout(timerId);
  }, [nextCheckDelay]);

  // 視窗返回只更新狀態文字；是否讀 API 仍由進入 Dashboard 或按鈕決定。
  useEffect(() => {
    const recalculateFreshness = () => setDashboardNow(Date.now());
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

  const loadDashboard = useCallback(async () => {
    const currentState = store.getState();
    const loaders = [
      {
        ...DASHBOARD_MODULES[0],
        slice: currentState.product,
        ensure: productData.fetchProducts,
        refresh: productData.refreshProducts,
      },
      {
        ...DASHBOARD_MODULES[1],
        slice: currentState.coupon,
        ensure: couponData.fetchCoupons,
        refresh: couponData.refreshCoupons,
      },
      {
        ...DASHBOARD_MODULES[2],
        slice: currentState.article,
        ensure: articleData.fetchArticles,
        refresh: articleData.refreshArticles,
      },
      {
        ...DASHBOARD_MODULES[3],
        slice: currentState.order,
        ensure: orderData.fetchOrders,
        refresh: orderData.refreshOrders,
      },
    ];

    const pendingLoaders = loaders.reduce((result, module) => {
      const refreshMode = getAdminModuleRefreshMode(module.slice);

      if (refreshMode === 'initial') {
        result.push({ ...module, load: module.ensure, mode: 'initial' });
      } else if (refreshMode === 'background') {
        result.push({
          ...module,
          load: () => module.refresh({ background: true }),
          mode: 'background',
        });
      }

      return result;
    }, []);

    const results = await Promise.allSettled(pendingLoaders.map((module) => module.load()));
    const failures = [];
    const refreshedModules = [];

    results.forEach((result, index) => {
      const module = pendingLoaders[index];

      if (result.status === 'rejected') {
        failures.push({
          key: module.key,
          label: module.label,
          mode: module.mode,
          reason: result.reason,
        });
      } else {
        refreshedModules.push({
          key: module.key,
          label: module.label,
          mode: module.mode,
        });
      }
    });

    setDashboardNow(Date.now());

    return {
      attemptedModules: pendingLoaders.map(({ key, label, mode }) => ({
        key,
        label,
        mode,
      })),
      failures,
      refreshedModules,
    };
  }, [
    articleData.fetchArticles,
    articleData.refreshArticles,
    couponData.fetchCoupons,
    couponData.refreshCoupons,
    orderData.fetchOrders,
    orderData.refreshOrders,
    productData.fetchProducts,
    productData.refreshProducts,
    store,
  ]);

  const freshnessSummary = useMemo(() => {
    return DASHBOARD_MODULES.reduce(
      (summary, module) => {
        const moduleData = modules[module.key];
        const freshness = moduleFreshness[module.key];
        const hasCachedData = Boolean(moduleData.lastFetchedAt);

        if (freshness.state === 'stale') summary.staleCount += 1;
        if (freshness.state === 'recommend') summary.recommendCount += 1;
        if (moduleData.status === 'loading') summary.refreshingCount += 1;
        if (moduleData.status === 'error') summary.errorCount += 1;
        if (!hasCachedData && moduleData.status === 'error') {
          summary.unavailableCount += 1;
        }
        if (
          moduleData.status !== 'loading' &&
          (!hasCachedData || moduleData.status === 'error' || freshness.state === 'stale')
        ) {
          summary.refreshableCount += 1;
        }

        return summary;
      },
      {
        staleCount: 0,
        recommendCount: 0,
        refreshingCount: 0,
        errorCount: 0,
        unavailableCount: 0,
        refreshableCount: 0,
      },
    );
  }, [moduleFreshness, modules]);

  return {
    freshnessSummary,
    loadDashboard,
    moduleFreshness,
    modules,
  };
};
