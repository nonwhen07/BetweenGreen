import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductHealthSummary = ({ summary, issueGroups }) => {
  const visibleGroups = issueGroups.slice(0, 5);

  return (
    <section className="admin-card admin-health-summary">
      <div className="admin-section-heading">
        <div>
          <h2 className="admin-section-heading__title">商品健康摘要</h2>
          <p className="admin-section-heading__description">
            依商品資料、分類、價格、標籤與圖片規格分析
          </p>
        </div>

        <Link className="btn btn-sm btn-outline-primary" to="/admin/products">
          查看全部商品
        </Link>
      </div>

      {visibleGroups.length === 0 ? (
        <div className="admin-empty-state">
          <p className="mb-1">目前沒有商品健康問題</p>
          <small>共 {summary.healthy} 筆商品通過目前檢查規則</small>
        </div>
      ) : (
        <div className="admin-health-summary__list">
          {visibleGroups.map((group) => (
            <Link
              key={group.code}
              className="admin-health-summary__item"
              to={`/admin/products?issue=${group.code}`}
            >
              <span>
                <span
                  className={`admin-health-badge admin-health-badge--${group.severity}`}
                >
                  {group.severity === 'error' ? '需處理' : '建議確認'}
                </span>
                <span>{group.label}</span>
              </span>
              <strong>{group.count} 筆</strong>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

ProductHealthSummary.propTypes = {
  summary: PropTypes.shape({
    healthy: PropTypes.number.isRequired,
  }).isRequired,
  issueGroups: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      severity: PropTypes.oneOf(['error', 'warning']).isRequired,
      count: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default ProductHealthSummary;

