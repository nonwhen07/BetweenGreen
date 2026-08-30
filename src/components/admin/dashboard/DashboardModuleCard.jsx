import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const DashboardModuleCard = ({
  title,
  description,
  href,
  status,
  error,
  lastFetchedAt,
  freshness,
  summary,
  metrics,
}) => {
  const hasCachedData = Boolean(lastFetchedAt);
  const isInitialLoading =
    (status === 'loading' || status === 'idle') && !hasCachedData;
  const isRefreshing = status === 'loading' && hasCachedData;
  const hasBlockingError = status === 'error' && !hasCachedData;
  const freshnessLabels = {
    empty: '尚未成功載入',
    fresh: '資料最新',
    recommend: '建議更新',
    stale: '可能過期',
  };
  const freshnessState = status === 'error' ? 'error' : freshness.state;
  const freshnessLabel =
    status === 'error'
      ? '更新失敗，保留舊資料'
      : isRefreshing
        ? '背景更新中'
        : freshnessLabels[freshness.state];

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

      {hasBlockingError ? (
        <div className="admin-dashboard-module__state text-danger" role="status">
          讀取失敗：{error || '請稍後再試'}
        </div>
      ) : (
        <>
          <div className="admin-dashboard-module__total">
            <span>資料總數</span>
            <strong>{isInitialLoading ? '—' : summary.total}</strong>
          </div>

          <div className="admin-dashboard-module__metrics">
            {metrics.map((metric) => (
              <div key={metric.key} className={`admin-dashboard-metric is-${metric.tone}`}>
                <span>{metric.label}</span>
                <strong>
                  {isInitialLoading ? '—' : summary[metric.key] || 0}
                </strong>
              </div>
            ))}
          </div>
        </>
      )}

      <div
        className={`admin-dashboard-module__freshness is-${freshnessState}`}
        role="status"
      >
        <span aria-hidden="true" />
        <strong>{freshnessLabel}</strong>
        <small>{freshness.relativeLabel}</small>
      </div>
    </article>
  );
};

DashboardModuleCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  error: PropTypes.string,
  lastFetchedAt: PropTypes.number,
  freshness: PropTypes.shape({
    state: PropTypes.oneOf(['empty', 'fresh', 'recommend', 'stale'])
      .isRequired,
    relativeLabel: PropTypes.string.isRequired,
  }).isRequired,
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
  lastFetchedAt: null,
};

export default DashboardModuleCard;
