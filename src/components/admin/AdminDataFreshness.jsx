import PropTypes from 'prop-types';

const STATE_LABELS = {
  empty: '等待載入',
  fresh: '資料最新',
  recommend: '建議更新',
  stale: '可能過期',
};

const AdminDataFreshness = ({
  state,
  relativeLabel,
  updatedAtLabel,
  hasRefreshError,
  isInteractionLocked,
  isRefreshing,
  onRefresh,
}) => {
  const displayState = hasRefreshError ? 'error' : state;
  const stateLabel = hasRefreshError ? '更新失敗' : STATE_LABELS[state] || STATE_LABELS.empty;
  const buttonTitle = isInteractionLocked
    ? '請先關閉目前的操作視窗，再更新資料。'
    : '只重新取得目前模組的資料';

  return (
    <section
      className={`admin-data-freshness admin-data-freshness--${displayState}`}
      aria-label="資料更新狀態"
      aria-live="polite"
    >
      <div className="admin-data-freshness__status">
        <span className="admin-data-freshness__indicator" aria-hidden="true" />
        <strong>{isRefreshing ? '更新中' : stateLabel}</strong>
        <span>{isRefreshing ? '正在取得最新資料…' : relativeLabel}</span>
        <span className="admin-data-freshness__time">最後成功：{updatedAtLabel}</span>
      </div>

      <button
        type="button"
        className="btn btn-sm btn-outline-secondary admin-data-freshness__button"
        onClick={onRefresh}
        disabled={isInteractionLocked || isRefreshing}
        title={buttonTitle}
      >
        {isRefreshing ? '更新中…' : '更新目前資料'}
      </button>
    </section>
  );
};

AdminDataFreshness.propTypes = {
  state: PropTypes.oneOf(['empty', 'fresh', 'recommend', 'stale']).isRequired,
  relativeLabel: PropTypes.string.isRequired,
  updatedAtLabel: PropTypes.string.isRequired,
  hasRefreshError: PropTypes.bool.isRequired,
  isInteractionLocked: PropTypes.bool.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default AdminDataFreshness;
