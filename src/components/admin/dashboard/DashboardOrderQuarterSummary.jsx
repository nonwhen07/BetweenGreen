import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { useOrderQuarterlyAnalytics } from '@/hooks/order/useOrderQuarterlyAnalytics';
import { formatOrderCurrency } from '@/utils/orderFormatter';

const DashboardOrderQuarterSummary = ({ orders, status, error }) => {
  const {
    analytics,
    currentQuarterKey,
    allOverdueUnpaidCount,
  } = useOrderQuarterlyAnalytics(orders);
  const isLoading = status === 'idle' || status === 'loading';
  const summary = analytics.summary;

  return (
    <section className="admin-card admin-dashboard-order-quarter">
      <div className="admin-dashboard-order-quarter__heading">
        <div>
          <h2>本季訂單摘要</h2>
          <p>{analytics.period?.label || currentQuarterKey}，營收只計算已付款訂單</p>
        </div>
        <Link
          className="btn btn-sm btn-outline-primary"
          to={`/admin/orders?quarter=${currentQuarterKey}#order-quarterly-report`}
        >
          查看季度報告
        </Link>
      </div>

      {status === 'error' ? (
        <div className="admin-dashboard-order-quarter__state text-danger" role="status">
          訂單資料讀取失敗：{error || '請稍後再試'}
        </div>
      ) : (
        <div className="admin-dashboard-order-quarter__stats">
          <div>
            <span>已付款營收</span>
            <strong>{isLoading ? '—' : `NT$ ${formatOrderCurrency(summary.paidRevenue)}`}</strong>
          </div>
          <div>
            <span>本季訂單</span>
            <strong>{isLoading ? '—' : `${summary.orderCount} 筆`}</strong>
          </div>
          <div>
            <span>平均已付款客單價</span>
            <strong>
              {isLoading ? '—' : `NT$ ${formatOrderCurrency(summary.averagePaidOrderValue)}`}
            </strong>
          </div>
          <div className={allOverdueUnpaidCount > 0 ? 'is-warning' : ''}>
            <span>全部逾期未付款</span>
            {isLoading ? (
              <strong>—</strong>
            ) : (
              <Link
                className="admin-dashboard-order-quarter__aging-link"
                to="/admin/orders?aging=overdue"
              >
                {allOverdueUnpaidCount} 筆
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

DashboardOrderQuarterSummary.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  status: PropTypes.string.isRequired,
  error: PropTypes.string,
};

DashboardOrderQuarterSummary.defaultProps = {
  error: '',
};

export default DashboardOrderQuarterSummary;
