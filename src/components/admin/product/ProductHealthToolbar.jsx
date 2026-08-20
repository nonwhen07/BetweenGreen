import PropTypes from 'prop-types';

const HEALTH_FILTERS = [
  { value: 'all', label: '全部商品', summaryKey: 'total' },
  { value: 'error', label: '需要處理', summaryKey: 'error' },
  { value: 'warning', label: '建議確認', summaryKey: 'warning' },
  { value: 'healthy', label: '健康商品', summaryKey: 'healthy' },
];

const ProductHealthToolbar = ({
  summary,
  issueGroups,
  healthFilter,
  issueFilter,
  onHealthFilterChange,
  onIssueFilterChange,
}) => {
  return (
    <section className="product-health-toolbar" aria-label="商品健康篩選">
      <div className="product-health-toolbar__stats">
        {HEALTH_FILTERS.map((item) => {
          const isActive = !issueFilter && healthFilter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              className={`product-health-stat ${isActive ? 'is-active' : ''}`}
              onClick={() => onHealthFilterChange(item.value)}
              aria-pressed={isActive}
            >
              <span>{item.label}</span>
              <strong>{summary[item.summaryKey]}</strong>
            </button>
          );
        })}
      </div>

      <div className="product-health-toolbar__issue-filter">
        <label htmlFor="product-health-issue" className="form-label mb-1">
          問題類型
        </label>
        <select
          id="product-health-issue"
          className="form-select"
          value={issueFilter}
          onChange={(event) => onIssueFilterChange(event.target.value)}
        >
          <option value="">全部問題類型</option>
          {issueGroups.map((group) => (
            <option key={group.code} value={group.code}>
              {group.label}（{group.count}）
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

ProductHealthToolbar.propTypes = {
  summary: PropTypes.shape({
    total: PropTypes.number.isRequired,
    error: PropTypes.number.isRequired,
    warning: PropTypes.number.isRequired,
    healthy: PropTypes.number.isRequired,
  }).isRequired,
  issueGroups: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    }),
  ).isRequired,
  healthFilter: PropTypes.oneOf(['all', 'error', 'warning', 'healthy'])
    .isRequired,
  issueFilter: PropTypes.string.isRequired,
  onHealthFilterChange: PropTypes.func.isRequired,
  onIssueFilterChange: PropTypes.func.isRequired,
};

export default ProductHealthToolbar;

