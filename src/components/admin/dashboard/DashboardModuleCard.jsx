import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const DashboardModuleCard = ({
  title,
  description,
  href,
  status,
  error,
  summary,
  metrics,
}) => {
  const isLoading = status === 'loading' || status === 'idle';
  const hasError = status === 'error';

  return (
    <article className="admin-card admin-dashboard-module">
      <div className="admin-dashboard-module__heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <Link className="btn btn-sm btn-outline-primary" to={href}>
          進入管理
        </Link>
      </div>

      {hasError ? (
        <div className="admin-dashboard-module__state text-danger" role="status">
          讀取失敗：{error || '請稍後再試'}
        </div>
      ) : (
        <>
          <div className="admin-dashboard-module__total">
            <span>資料總數</span>
            <strong>{isLoading ? '—' : summary.total}</strong>
          </div>

          <div className="admin-dashboard-module__metrics">
            {metrics.map((metric) => (
              <div key={metric.key} className={`admin-dashboard-metric is-${metric.tone}`}>
                <span>{metric.label}</span>
                <strong>{isLoading ? '—' : summary[metric.key] || 0}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
};

DashboardModuleCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  error: PropTypes.string,
  summary: PropTypes.shape({
    total: PropTypes.number.isRequired,
  }).isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      tone: PropTypes.oneOf(['default', 'error', 'warning', 'healthy']).isRequired,
    }),
  ).isRequired,
};

DashboardModuleCard.defaultProps = {
  error: '',
};

export default DashboardModuleCard;
