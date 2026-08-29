import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ACTIVITY_FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'unreviewed', label: '待確認' },
  { value: 'reviewed', label: '已確認' },
];

const MODULE_LABEL_MAP = {
  product: '商品',
  coupon: '優惠券',
  article: '文章',
  order: '訂單',
};

const ACTION_LABEL_MAP = {
  create: '新增',
  update: '編輯',
  delete: '刪除',
  export: '匯出',
  'batch-create': '批次新增',
  'batch-update': '批次更新',
};

const STATUS_LABEL_MAP = {
  success: '成功',
  partial: '部分成功',
  error: '失敗',
};

const formatActivityTime = (createdAt) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '時間未記錄';

  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

const AdminActivityPanel = ({
  sectionId,
  title,
  description,
  activities,
  showFilters,
  showDetails,
  viewAllHref,
  onReviewedChange,
}) => {
  const [filter, setFilter] = useState('all');

  const filterCounts = useMemo(
    () => ({
      all: activities.length,
      unreviewed: activities.filter((activity) => !activity.isReviewed).length,
      reviewed: activities.filter((activity) => activity.isReviewed).length,
    }),
    [activities],
  );

  const visibleActivities = useMemo(() => {
    if (filter === 'unreviewed') {
      return activities.filter((activity) => !activity.isReviewed);
    }

    if (filter === 'reviewed') {
      return activities.filter((activity) => activity.isReviewed);
    }

    return activities;
  }, [activities, filter]);

  return (
    <section id={sectionId} className="admin-card admin-activity-panel">
      <div className="admin-section-heading">
        <div>
          <h2 className="admin-section-heading__title">{title}</h2>
          <p className="admin-section-heading__description">{description}</p>
        </div>

        <div className="admin-activity-panel__heading-actions">
          {showFilters && (
            <div className="admin-activity-panel__filters" aria-label="操作紀錄篩選">
              {ACTIVITY_FILTERS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`btn btn-sm ${filter === item.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter(item.value)}
                  aria-pressed={filter === item.value}
                >
                  {item.label} {filterCounts[item.value]}
                </button>
              ))}
            </div>
          )}

          {viewAllHref && (
            <Link to={viewAllHref} className="btn btn-sm btn-outline-primary">
              查看全部
            </Link>
          )}
        </div>
      </div>

      {visibleActivities.length === 0 ? (
        <div className="admin-empty-state">
          <p className="mb-1">尚未開始記錄</p>
          <small>下一次完成模組操作後，結果會顯示於此。</small>
        </div>
      ) : (
        <div className="admin-activity-list">
          {visibleActivities.map((activity) => (
            <article
              key={activity.id}
              className={`admin-activity-item admin-activity-item--${activity.status} ${!activity.isReviewed ? 'is-unreviewed' : ''}`}
            >
              <div className="admin-activity-item__main">
                <div className="admin-activity-item__title-row">
                  <strong>
                    {MODULE_LABEL_MAP[activity.module] || activity.module}{' '}
                    {ACTION_LABEL_MAP[activity.action] || activity.action}
                  </strong>
                  <span className={`admin-activity-status admin-activity-status--${activity.status}`}>
                    {STATUS_LABEL_MAP[activity.status] || activity.status}
                  </span>
                  {!activity.isReviewed && (
                    <span className="admin-activity-review-state">待確認</span>
                  )}
                </div>

                <div className="admin-activity-item__meta">
                  <span>{formatActivityTime(activity.createdAt)}</span>
                  <span>共 {activity.totalCount} 筆</span>
                  <span className="text-success">成功 {activity.successCount}</span>
                  <span className={activity.errorCount > 0 ? 'text-danger' : ''}>
                    失敗 {activity.errorCount}
                  </span>
                </div>

                {showDetails && activity.details.length > 0 && (
                  <details className="admin-activity-item__details">
                    <summary>查看 {activity.details.length} 筆錯誤明細</summary>
                    <ul>
                      {activity.details.map((detail) => (
                        <li key={detail.key || `${detail.id}-${detail.title}`}>
                          <span>{detail.title || detail.id || '未命名資料'}</span>
                          <small>{detail.message}</small>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>

              <button
                type="button"
                className={`btn btn-sm ${activity.isReviewed ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
                onClick={() => onReviewedChange(activity.id, !activity.isReviewed)}
              >
                {activity.isReviewed ? '改為待確認' : '標記已確認'}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

AdminActivityPanel.propTypes = {
  sectionId: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      module: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['success', 'partial', 'error']).isRequired,
      totalCount: PropTypes.number.isRequired,
      successCount: PropTypes.number.isRequired,
      errorCount: PropTypes.number.isRequired,
      isReviewed: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
      details: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          id: PropTypes.string,
          title: PropTypes.string,
          message: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  showFilters: PropTypes.bool,
  showDetails: PropTypes.bool,
  viewAllHref: PropTypes.string,
  onReviewedChange: PropTypes.func.isRequired,
};

AdminActivityPanel.defaultProps = {
  sectionId: undefined,
  showFilters: false,
  showDetails: false,
  viewAllHref: '',
};

export default AdminActivityPanel;
