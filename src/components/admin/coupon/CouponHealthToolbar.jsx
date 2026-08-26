import PropTypes from 'prop-types';

// components
import AdminHealthToolbar from '@/components/admin/AdminHealthToolbar';

const HEALTH_FILTERS = [
  { value: 'all', label: '全部優惠券', summaryKey: 'total' },
  { value: 'error', label: '需要處理', summaryKey: 'error' },
  { value: 'warning', label: '建議確認', summaryKey: 'warning' },
  { value: 'healthy', label: '健康優惠券', summaryKey: 'healthy' },
];

const CouponHealthToolbar = ({
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
      ariaLabel="優惠券健康篩選"
      filters={filters}
      activeFilter={healthFilter}
      issueFilter={issueFilter}
      issueGroups={issueGroups}
      issueSelectId="coupon-health-issue"
      onFilterChange={onHealthFilterChange}
      onIssueFilterChange={onIssueFilterChange}
    />
  );
};

CouponHealthToolbar.propTypes = {
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

export default CouponHealthToolbar;
