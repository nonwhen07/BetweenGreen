import PropTypes from 'prop-types';

const AdminActivityPlaceholder = ({ title, description, showFilters }) => {
  return (
    <section className="admin-card admin-activity-panel">
      <div className="admin-section-heading">
        <div>
          <h2 className="admin-section-heading__title">{title}</h2>
          <p className="admin-section-heading__description">{description}</p>
        </div>

        {showFilters && (
          <div className="admin-activity-panel__filters" aria-label="操作紀錄篩選預留">
            <button type="button" className="btn btn-sm btn-primary" disabled>
              全部
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
              待確認
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
              已確認
            </button>
          </div>
        )}
      </div>

      <div className="admin-empty-state">
        <p className="mb-1">尚未開始記錄</p>
        <small>下一次批次新增或更新後，操作結果會顯示於此。</small>
      </div>
    </section>
  );
};

AdminActivityPlaceholder.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  showFilters: PropTypes.bool,
};

AdminActivityPlaceholder.defaultProps = {
  showFilters: false,
};

export default AdminActivityPlaceholder;
