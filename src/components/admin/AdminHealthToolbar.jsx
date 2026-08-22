import PropTypes from 'prop-types';

/**
 * 後台健康篩選共用 UI。
 *
 * 本元件只接收已整理好的 filter/count 與 issue groups，不知道 Product、
 * Coupon 或 Article 的健康規則；各模組應建立自己的 adapter 負責轉換資料。
 *
 * TODO(Coupon)：新增 components/admin/coupon/CouponHealthToolbar.jsx。
 * TODO(Article)：新增 components/admin/article/ArticleHealthToolbar.jsx。
 */
const AdminHealthToolbar = ({
  ariaLabel,
  filters,
  activeFilter,
  issueFilter,
  issueGroups,
  issueSelectId,
  issueLabel = '問題類型',
  allIssuesLabel = '全部問題類型',
  onFilterChange,
  onIssueFilterChange,
}) => {
  return (
    <section className="admin-health-toolbar" aria-label={ariaLabel}>
      <div className="admin-health-toolbar__stats">
        {filters.map((filter) => {
          const isActive = !issueFilter && activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              className={`admin-health-stat ${isActive ? 'is-active' : ''}`}
              onClick={() => onFilterChange(filter.value)}
              aria-pressed={isActive}
            >
              <span>{filter.label}</span>
              <strong>{filter.count}</strong>
            </button>
          );
        })}
      </div>

      <div className="admin-health-toolbar__issue-filter">
        <label htmlFor={issueSelectId} className="form-label mb-1">
          {issueLabel}
        </label>
        <select
          id={issueSelectId}
          className="form-select"
          value={issueFilter}
          onChange={(event) => onIssueFilterChange(event.target.value)}
        >
          <option value="">{allIssuesLabel}</option>
          {issueGroups.map((group) => (
            <option key={group.code} value={group.code}>
              {group.label}（{group.count}）
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

AdminHealthToolbar.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    }),
  ).isRequired,
  activeFilter: PropTypes.string.isRequired,
  issueFilter: PropTypes.string.isRequired,
  issueGroups: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    }),
  ).isRequired,
  issueSelectId: PropTypes.string.isRequired,
  issueLabel: PropTypes.string,
  allIssuesLabel: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  onIssueFilterChange: PropTypes.func.isRequired,
};

export default AdminHealthToolbar;
