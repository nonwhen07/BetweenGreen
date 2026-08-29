import PropTypes from 'prop-types';

import AdminHealthToolbar from '@/components/admin/AdminHealthToolbar';

const HEALTH_FILTERS = [
  { value: 'all', label: '全部訂單', summaryKey: 'total' },
  { value: 'error', label: '需要處理', summaryKey: 'error' },
  { value: 'warning', label: '建議確認', summaryKey: 'warning' },
  { value: 'healthy', label: '資料正常', summaryKey: 'healthy' },
  { value: 'paid', label: '已付款', summaryKey: 'paid' },
  { value: 'unpaid', label: '未付款', summaryKey: 'unpaid' },
];

const OrderHealthToolbar = ({
  summary,
  issueGroups,
  healthFilter,
  issueFilter,
  isAgingFilterActive,
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
      ariaLabel="訂單健康與付款狀態篩選"
      filters={filters}
      activeFilter={isAgingFilterActive ? '' : healthFilter}
      issueFilter={issueFilter}
      issueGroups={issueGroups}
      issueSelectId="order-health-issue"
      onFilterChange={onHealthFilterChange}
      onIssueFilterChange={onIssueFilterChange}
    />
  );
};

OrderHealthToolbar.propTypes = {
  summary: PropTypes.shape({
    total: PropTypes.number.isRequired,
    error: PropTypes.number.isRequired,
    warning: PropTypes.number.isRequired,
    healthy: PropTypes.number.isRequired,
    paid: PropTypes.number.isRequired,
    unpaid: PropTypes.number.isRequired,
  }).isRequired,
  issueGroups: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    }),
  ).isRequired,
  healthFilter: PropTypes.oneOf([
    'all',
    'error',
    'warning',
    'healthy',
    'paid',
    'unpaid',
  ]).isRequired,
  issueFilter: PropTypes.string.isRequired,
  isAgingFilterActive: PropTypes.bool.isRequired,
  onHealthFilterChange: PropTypes.func.isRequired,
  onIssueFilterChange: PropTypes.func.isRequired,
};

export default OrderHealthToolbar;
