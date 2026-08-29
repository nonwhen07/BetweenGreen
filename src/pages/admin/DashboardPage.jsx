import { useEffect } from 'react';

// hooks
import { useAdminActivities } from '@/hooks/activity/useAdminActivities';
import { useAdminDashboardData } from '@/hooks/dashboard/useAdminDashboardData';
import { useToast } from '@/hooks/useToast';
// components
import AdminActivityPanel from '@/components/admin/AdminActivityPanel';
import DashboardIssueSummary from '@/components/admin/dashboard/DashboardIssueSummary';
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
  const { loadDashboard, modules } = useAdminDashboardData();
  const { showError, warning } = useToast();
  const { activities, markActivityReviewed } = useAdminActivities({
    dashboard: true,
    limit: 5,
  });

  useEffect(() => {
    let isActive = true;

    loadDashboard().then((failures) => {
      if (isActive && failures.length > 0) {
        const failedLabels = failures.map((failure) => failure.label).join('、');
        warning(`${failedLabels}讀取失敗，其餘資料仍可使用`);
      }
    });

    return () => {
      isActive = false;
    };
  }, [loadDashboard, warning]);

  const issueModules = DASHBOARD_MODULE_CONFIG.map((config) => ({
    key: config.key,
    label: config.title,
    href: config.href,
    status: modules[config.key].status,
    issueGroups:
      modules[config.key].status === 'success'
        ? modules[config.key].health.issueGroups
        : [],
  }));

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
