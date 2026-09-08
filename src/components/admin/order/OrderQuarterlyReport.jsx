import PropTypes from 'prop-types';

import { formatOrderCurrency } from '@/utils/order/orderFormatter';

const OrderQuarterlyReport = ({
  analytics,
  quarterOptions,
  selectedQuarter,
  allOverdueUnpaidCount,
  onQuarterChange,
}) => {
  const { period, summary, topProducts, topCustomers } = analytics;

  return (
    <section id="order-quarterly-report" className="admin-card admin-order-analytics">
      <div className="admin-section-heading">
        <div>
          <h2 className="admin-section-heading__title">季度訂單分析</h2>
          <p className="admin-section-heading__description">
            營收與排行只計算已付款訂單；未付款提醒仍包含在 訂單健康檢查中
          </p>
        </div>

        <div className="admin-order-analytics__quarter-select">
          <label htmlFor="order-analytics-quarter" className="form-label mb-1">
            分析季度
          </label>
          <select
            id="order-analytics-quarter"
            className="form-select"
            value={selectedQuarter}
            onChange={(event) => onQuarterChange(event.target.value)}
          >
            {quarterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-order-analytics__stats" aria-label={`${period?.label || ''}統計`}>
        <div className="admin-order-analytics-stat is-primary">
          <span>已付款營收</span>
          <strong>NT$ {formatOrderCurrency(summary.paidRevenue)}</strong>
        </div>
        <div className="admin-order-analytics-stat">
          <span>訂單／已付款</span>
          <strong>
            {summary.orderCount}／{summary.paidOrderCount} 筆
          </strong>
        </div>
        <div className="admin-order-analytics-stat">
          <span>平均已付款客單價</span>
          <strong>NT$ {formatOrderCurrency(summary.averagePaidOrderValue)}</strong>
        </div>
        <div className="admin-order-analytics-stat">
          <span>付款率</span>
          <strong>{summary.paymentRate}%</strong>
        </div>
        <div className="admin-order-analytics-stat is-warning">
          <span>本季／全部逾期未付款</span>
          <strong>
            {summary.overdueUnpaidCount}／{allOverdueUnpaidCount} 筆
          </strong>
        </div>
        <div className="admin-order-analytics-stat">
          <span>付費顧客／回購率</span>
          <strong>
            {summary.customerCount} 人／{summary.repeatCustomerRate}%
          </strong>
        </div>
      </div>

      {summary.orderCount === 0 ? (
        <div className="admin-empty-state admin-empty-state--panel">
          <p className="mb-1">{period?.label || selectedQuarter}目前沒有訂單</p>
          <small>可切換其他季度查看歷史資料。</small>
        </div>
      ) : (
        <div className="admin-order-analytics__rankings">
          <section>
            <h3>已付款商品排行</h3>
            {topProducts.length === 0 ? (
              <p className="text-muted small mb-0">本季尚無已付款商品資料</p>
            ) : (
              <ol className="admin-order-ranking">
                {topProducts.map((product) => (
                  <li key={product.key}>
                    <span>{product.title}</span>
                    <small>{product.quantity} 件</small>
                    <strong>NT$ {formatOrderCurrency(product.revenue)}</strong>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section>
            <h3>已付款顧客排行</h3>
            {topCustomers.length === 0 ? (
              <p className="text-muted small mb-0">本季尚無可辨識的付費顧客</p>
            ) : (
              <ol className="admin-order-ranking">
                {topCustomers.map((customer) => (
                  <li key={customer.key}>
                    <span>{customer.name}</span>
                    <small>{customer.orderCount} 筆</small>
                    <strong>NT$ {formatOrderCurrency(customer.revenue)}</strong>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      )}
    </section>
  );
};

OrderQuarterlyReport.propTypes = {
  analytics: PropTypes.shape({
    period: PropTypes.shape({ label: PropTypes.string.isRequired }),
    summary: PropTypes.shape({
      orderCount: PropTypes.number.isRequired,
      paidOrderCount: PropTypes.number.isRequired,
      paidRevenue: PropTypes.number.isRequired,
      averagePaidOrderValue: PropTypes.number.isRequired,
      paymentRate: PropTypes.number.isRequired,
      overdueUnpaidCount: PropTypes.number.isRequired,
      customerCount: PropTypes.number.isRequired,
      repeatCustomerRate: PropTypes.number.isRequired,
    }).isRequired,
    topProducts: PropTypes.arrayOf(PropTypes.object).isRequired,
    topCustomers: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  quarterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedQuarter: PropTypes.string.isRequired,
  allOverdueUnpaidCount: PropTypes.number.isRequired,
  onQuarterChange: PropTypes.func.isRequired,
};

export default OrderQuarterlyReport;
