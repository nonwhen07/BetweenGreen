import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const MAX_VISIBLE_ISSUES = 8;

const DashboardIssueSummary = ({ modules }) => {
  const allModulesReady = modules.every((module) => module.status === 'success');
  const visibleIssues = useMemo(() => {
    return modules
      .flatMap((module) =>
        module.issueGroups.map((issue) => ({
          ...issue,
          moduleKey: module.key,
          moduleLabel: module.label,
          href: `${module.href}?issue=${encodeURIComponent(issue.code)}`,
        })),
      )
      .sort((left, right) => {
        if (left.severity !== right.severity) {
          return left.severity === 'error' ? -1 : 1;
        }

        return right.count - left.count;
      })
      .slice(0, MAX_VISIBLE_ISSUES);
  }, [modules]);

  return (
    <section className="admin-card admin-dashboard-issues">
      <div className="admin-section-heading">
        <div>
          <h2 className="admin-section-heading__title">跨模組健康摘要</h2>
          <p className="admin-section-heading__description">
            優先顯示需要處理的資料，點選後帶入對應模組問題篩選
          </p>
        </div>
      </div>

      {visibleIssues.length === 0 ? (
        <div className="admin-empty-state">
          <p className="mb-1">
            {allModulesReady ? '目前沒有健康問題' : '目前沒有可顯示的健康問題'}
          </p>
          <small>
            {allModulesReady
              ? '四個模組皆通過目前已定義的檢查規則。'
              : '部分模組仍在讀取或讀取失敗，請參考上方模組卡片。'}
          </small>
        </div>
      ) : (
        <div className="admin-dashboard-issues__list">
          {visibleIssues.map((issue) => (
            <Link
              key={`${issue.moduleKey}-${issue.code}`}
              className="admin-dashboard-issues__item"
              to={issue.href}
            >
              <span className={`admin-health-badge admin-health-badge--${issue.severity}`}>
                {issue.severity === 'error' ? '需處理' : '建議確認'}
              </span>
              <span className="admin-dashboard-issues__module">{issue.moduleLabel}</span>
              <span className="admin-dashboard-issues__label">{issue.label}</span>
              <strong>{issue.count} 筆</strong>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

DashboardIssueSummary.propTypes = {
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      issueGroups: PropTypes.arrayOf(
        PropTypes.shape({
          code: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          severity: PropTypes.oneOf(['error', 'warning']).isRequired,
          count: PropTypes.number.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
};

export default DashboardIssueSummary;
