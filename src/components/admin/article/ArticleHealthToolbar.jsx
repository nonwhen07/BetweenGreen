import PropTypes from 'prop-types';

import AdminHealthToolbar from '@/components/admin/AdminHealthToolbar';

const HEALTH_FILTERS = [
  { value: 'all', label: '全部文章', summaryKey: 'total' },
  { value: 'error', label: '需要處理', summaryKey: 'error' },
  { value: 'warning', label: '建議確認', summaryKey: 'warning' },
  { value: 'healthy', label: '健康文章', summaryKey: 'healthy' },
];

const ArticleHealthToolbar = ({
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
      ariaLabel="文章健康篩選"
      filters={filters}
      activeFilter={healthFilter}
      issueFilter={issueFilter}
      issueGroups={issueGroups}
      issueSelectId="article-health-issue"
      onFilterChange={onHealthFilterChange}
      onIssueFilterChange={onIssueFilterChange}
    />
  );
};

ArticleHealthToolbar.propTypes = {
  summary: PropTypes.shape({
    total: PropTypes.number.isRequired,
    error: PropTypes.number.isRequired,
    warning: PropTypes.number.isRequired,
    healthy: PropTypes.number.isRequired,
  }).isRequired,
  issueGroups: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })).isRequired,
  healthFilter: PropTypes.oneOf(['all', 'error', 'warning', 'healthy']).isRequired,
  issueFilter: PropTypes.string.isRequired,
  onHealthFilterChange: PropTypes.func.isRequired,
  onIssueFilterChange: PropTypes.func.isRequired,
};

export default ArticleHealthToolbar;
