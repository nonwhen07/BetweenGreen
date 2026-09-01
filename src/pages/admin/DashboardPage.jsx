import { useEffect } from 'react';

// hooks
import { useAdminActivities } from '@/hooks/activity/useAdminActivities';
import { useAdminDashboardData } from '@/hooks/dashboard/useAdminDashboardData';
import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/hooks/useToast';
// components
import AdminActivityPanel from '@/components/admin/AdminActivityPanel';
import DashboardIssueSummary from '@/components/admin/dashboard/DashboardIssueSummary';
import DashboardFreshnessSummary from '@/components/admin/dashboard/DashboardFreshnessSummary';
import DashboardModuleCard from '@/components/admin/dashboard/DashboardModuleCard';
import DashboardOrderQuarterSummary from '@/components/admin/dashboard/DashboardOrderQuarterSummary';

const DASHBOARD_MODULE_CONFIG = [
  {
    key: 'product',
    title: '商品',
    description: '商品內容、價格、分類與圖片',
    href: '/admin/products',
    metrics: [
      { key: 'error', label: '需處理', tone: 'error' },
      { key: 'warning', label: '建議確認', tone: 'warning' },
      { key: 'healthy', label: '健康', tone: 'healthy' },
    ],
  },
  {
    key: 'coupon',
    title: '優惠券',
    description: '折扣設定、啟用狀態與期限',
    href: '/admin/coupons',
    metrics: [
      { key: 'error', label: '需處理', tone: 'error' },
      { key: 'expiringSoon', label: '即將到期', tone: 'warning' },
      { key: 'healthy', label: '健康', tone: 'healthy' },
    ],
  },
  {
    key: 'article',
    title: '文章',
    description: '公開狀態、投放期間與內容設定',
    href: '/admin/articles',
    metrics: [
      { key: 'error', label: '需處理', tone: 'error' },
      { key: 'scheduled', label: '已排程', tone: 'warning' },
      { key: 'published', label: '公開中', tone: 'healthy' },
    ],
  },
  {
    key: 'order',
    title: '訂單',
    description: '顧客資料、商品明細與付款狀態',
    href: '/admin/orders',
    metrics: [
      { key: 'error', label: '需處理', tone: 'error' },
      { key: 'unpaid', label: '未付款', tone: 'warning' },
      { key: 'paid', label: '已付款', tone: 'healthy' },
    ],
  },
];

const DashboardPage = () => {
  const {
    freshnessSummary,
    loadDashboard,
    moduleFreshness,
    modules,
  } = useAdminDashboardData();
  const { start, stop } = useLoading();
  const { info, showError, success, warning } = useToast();
  const { activities, markActivityReviewed } = useAdminActivities({
    dashboard: true,
    limit: 5,
  });

  useEffect(() => {
    let isActive = true;

    loadDashboard().then(({ failures }) => {
      if (isActive && failures.length > 0) {
        const failedLabels = failures.map((failure) => failure.label).join('、');
        warning(`${failedLabels}讀取失敗，其餘資料仍可使用`);
      }
    });

    return () => {
      isActive = false;
    };
  }, [loadDashboard, warning]);

  const handleRefreshDashboard = async () => {
    start();

    try {
      const { attemptedModules, failures, refreshedModules } =
        await loadDashboard();

      if (failures.length > 0) {
        const failedLabels = failures
          .map((failure) => failure.label)
          .join('、');
        warning(`${failedLabels}更新失敗，原有資料仍保留`);
      }

      if (refreshedModules.length > 0) {
        const refreshedLabels = refreshedModules
          .map((module) => module.label)
          .join('、');
        success(`${refreshedLabels}已更新`);
      } else if (attemptedModules.length === 0) {
        info('目前沒有需要更新的模組');
      }
    } catch {
      showError('更新後台模組失敗，請稍後再試。');
    } finally {
      stop();
    }
  };

  const issueModules = DASHBOARD_MODULE_CONFIG.map((config) => {
    const moduleData = modules[config.key];
    const hasCachedData = Boolean(moduleData.lastFetchedAt);

    return {
      key: config.key,
      label: config.title,
      href: config.href,
      status: hasCachedData ? 'success' : moduleData.status,
      issueGroups: hasCachedData
        ? moduleData.health.issueGroups
        : [],
    };
  });

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <h1 className="admin-page-heading__title">後台總覽</h1>
          <p className="admin-page-heading__description">
            快速查看商品、優惠券、文章、訂單的資料狀態與近期操作
          </p>
        </div>
      </div>

      <DashboardFreshnessSummary
        {...freshnessSummary}
        onRefresh={handleRefreshDashboard}
      />

      <section className="admin-dashboard__modules" aria-label="後台模組摘要">
        {DASHBOARD_MODULE_CONFIG.map((config) => {
          const moduleData = modules[config.key];

          return (
            <DashboardModuleCard
              key={config.key}
              title={config.title}
              description={config.description}
              href={config.href}
              status={moduleData.status}
              error={moduleData.error}
              lastFetchedAt={moduleData.lastFetchedAt}
              freshness={moduleFreshness[config.key]}
              summary={moduleData.health.summary}
              metrics={config.metrics}
            />
          );
        })}
      </section>

      <DashboardOrderQuarterSummary
        orders={modules.order.orders}
        status={modules.order.status}
        error={modules.order.error}
        hasCachedData={Boolean(modules.order.lastFetchedAt)}
      />

      <div className="admin-dashboard__overview">
        <DashboardIssueSummary modules={issueModules} />

        <AdminActivityPanel
          title="近期後台操作"
          description="整合四個模組的近期操作，未確認異常會優先保留"
          activities={activities}
          onReviewedChange={(activityId, isReviewed) =>
            markActivityReviewed(activityId, isReviewed).catch(showError)
          }
        />
      </div>
    </div>
  );
};

export default DashboardPage;
