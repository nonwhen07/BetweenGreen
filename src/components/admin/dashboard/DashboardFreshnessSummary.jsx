import PropTypes from 'prop-types';

const DashboardFreshnessSummary = ({
  staleCount,
  recommendCount,
  errorCount,
  unavailableCount,
  refreshingCount,
  refreshableCount,
  onRefresh,
}) => {
  const isRefreshing = refreshingCount > 0;
  let state = 'fresh';
  let title = '四個模組資料皆在有效時間內';

  if (isRefreshing) {
    state = 'refreshing';
    title = `正在更新 ${refreshingCount} 個模組`;
  } else if (errorCount > 0) {
    state = 'error';
    title =
      unavailableCount > 0
        ? `${unavailableCount} 個模組目前沒有可用資料`
        : `${errorCount} 個模組上次更新失敗`;
  } else if (staleCount > 0) {
    state = 'stale';
    title = `${staleCount} 個模組資料可能過期`;
  } else if (recommendCount > 0) {
    state = 'recommend';
    title = `${recommendCount} 個模組建議稍後更新`;
  }

  return (
    <section
      className={`admin-dashboard-freshness is-${state}`}
      aria-label="Dashboard 資料更新狀態"
      aria-live="polite"
    >
      <div className="admin-dashboard-freshness__content">
        <span className="admin-dashboard-freshness__indicator" aria-hidden="true" />
        <div>
          <strong>{title}</strong>
          <p>回到瀏覽器只重算提示；進入總覽或按下按鈕才讀取需要更新的模組。</p>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={onRefresh}
        disabled={isRefreshing || refreshableCount === 0}
      >
        {isRefreshing ? '更新中…' : '更新需處理模組'}
      </button>
    </section>
  );
};

DashboardFreshnessSummary.propTypes = {
  staleCount: PropTypes.number.isRequired,
  recommendCount: PropTypes.number.isRequired,
  errorCount: PropTypes.number.isRequired,
  unavailableCount: PropTypes.number.isRequired,
  refreshingCount: PropTypes.number.isRequired,
  refreshableCount: PropTypes.number.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default DashboardFreshnessSummary;
