import PropTypes from 'prop-types';

// components
import AdminHealthToolbar from '@/components/admin/AdminHealthToolbar';

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
  const filters = HEALTH_FILTERS.map((filter) => ({
    value: filter.value,
    label: filter.label,
    count: summary[filter.summaryKey],
  }));

  return (
    <AdminHealthToolbar
      ariaLabel="商品健康篩選"
      filters={filters}
      activeFilter={healthFilter}
      issueFilter={issueFilter}
      issueGroups={issueGroups}
      issueSelectId="product-health-issue"
      onFilterChange={onHealthFilterChange}
      onIssueFilterChange={onIssueFilterChange}
    />
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
