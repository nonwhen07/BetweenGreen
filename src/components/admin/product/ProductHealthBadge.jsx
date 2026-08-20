import PropTypes from 'prop-types';

const ProductHealthBadge = ({ health }) => {
  if (!health || health.status === 'healthy') {
    return <span className="admin-health-badge admin-health-badge--healthy">健康</span>;
  }

  const firstIssue = health.issues[0];
  const extraIssueCount = health.issues.length - 1;

  return (
    <div className="admin-product-health">
      <span className={`admin-health-badge admin-health-badge--${health.status}`}>
        {health.status === 'error' ? '需處理' : '建議確認'}
      </span>
      <small>{firstIssue?.label}</small>
      {extraIssueCount > 0 && <small>另有 {extraIssueCount} 項</small>}
    </div>
  );
};

ProductHealthBadge.propTypes = {
  health: PropTypes.shape({
    status: PropTypes.oneOf(['healthy', 'warning', 'error']).isRequired,
    issues: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }),
};

ProductHealthBadge.defaultProps = {
  health: null,
};

export default ProductHealthBadge;

