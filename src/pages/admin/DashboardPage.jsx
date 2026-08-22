import { useEffect } from 'react';

// hooks
import { useAdminActivities } from '@/hooks/activity/useAdminActivities';
import { useAdminProducts } from '@/hooks/product/useAdminProducts';
import { useToast } from '@/hooks/useToast';
import { useProductHealth } from '@/hooks/product/useProductHealth';
// components
import AdminActivityPanel from '@/components/admin/AdminActivityPanel';
import ProductHealthSummary from '@/components/admin/product/ProductHealthSummary';

const DashboardPage = () => {
  const { products, fetchProducts } = useAdminProducts();
  const { showError } = useToast();
  const { summary, issueGroups } = useProductHealth(products);
  const { activities, markActivityReviewed } = useAdminActivities({
    dashboard: true,
    limit: 5,
  });

  useEffect(() => {
    fetchProducts().catch(showError);
  }, [fetchProducts, showError]);

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <h1 className="admin-page-heading__title">後台總覽</h1>
          <p className="admin-page-heading__description">
            快速查看商品資料狀態與近期後台操作
          </p>
        </div>
      </div>

      <section className="admin-grid admin-dashboard__stats" aria-label="商品健康統計">
        <article className="admin-stat">
          <div>
            <div className="admin-stat__title">商品總數</div>
            <div className="admin-stat__value">{summary.total}</div>
          </div>
        </article>

        <article className="admin-stat admin-stat--error">
          <div>
            <div className="admin-stat__title">需要處理</div>
            <div className="admin-stat__value">{summary.error}</div>
          </div>
        </article>

        <article className="admin-stat admin-stat--warning">
          <div>
            <div className="admin-stat__title">建議確認</div>
            <div className="admin-stat__value">{summary.warning}</div>
          </div>
        </article>

        <article className="admin-stat admin-stat--healthy">
          <div>
            <div className="admin-stat__title">健康商品</div>
            <div className="admin-stat__value">{summary.healthy}</div>
          </div>
        </article>
      </section>

      <div className="admin-dashboard__overview">
        <ProductHealthSummary summary={summary} issueGroups={issueGroups} />

        <AdminActivityPanel
          title="近期批次操作"
          description="顯示近期已完成操作，未確認異常會持續保留"
          activities={activities}
          viewAllHref="/admin/products#product-activity"
          onReviewedChange={(activityId, isReviewed) =>
            markActivityReviewed(activityId, isReviewed).catch(showError)
          }
        />
      </div>
    </div>
  );
};

export default DashboardPage;
