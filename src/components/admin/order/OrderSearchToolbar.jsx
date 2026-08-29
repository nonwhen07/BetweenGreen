import PropTypes from 'prop-types';

const OrderSearchToolbar = ({
  keyword,
  dateFrom,
  dateTo,
  agingFilter,
  agingSummary,
  dateRangeError,
  resultCount,
  totalCount,
  onKeywordChange,
  onDateFromChange,
  onDateToChange,
  onAgingFilterChange,
  onReset,
}) => {
  const hasFilters = Boolean(keyword || dateFrom || dateTo);

  return (
    <section
      className="admin-card admin-order-search"
      aria-label="訂單搜尋與日期篩選"
    >
      <div className="admin-order-search__fields">
        <div className="admin-order-search__keyword">
          <label htmlFor="order-search-keyword" className="form-label">
            搜尋訂單
          </label>
          <input
            id="order-search-keyword"
            type="search"
            className="form-control"
            value={keyword}
            placeholder="訂單編號、姓名、Email 或電話"
            onChange={(event) => onKeywordChange(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="order-search-date-from" className="form-label">
            開始日期
          </label>
          <input
            id="order-search-date-from"
            type="date"
            className={`form-control ${dateRangeError ? 'is-invalid' : ''}`}
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(event) => onDateFromChange(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="order-search-date-to" className="form-label">
            結束日期
          </label>
          <input
            id="order-search-date-to"
            type="date"
            className={`form-control ${dateRangeError ? 'is-invalid' : ''}`}
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(event) => onDateToChange(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="order-search-aging" className="form-label">
            未付款帳齡
          </label>
          <select
            id="order-search-aging"
            className="form-select"
            value={agingFilter}
            onChange={(event) => onAgingFilterChange(event.target.value)}
          >
            <option value="">不限帳齡</option>
            <option value="recent">0～2 天（{agingSummary.recent}）</option>
            <option value="review">3～6 天（{agingSummary.review}）</option>
            <option value="overdue">7 天以上（{agingSummary.overdue}）</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={!hasFilters}
          onClick={onReset}
        >
          清除搜尋
        </button>
      </div>

      <div className="admin-order-search__status" aria-live="polite">
        {dateRangeError ? (
          <span className="text-danger">{dateRangeError}</span>
        ) : (
          <span className="text-muted">
            找到 {resultCount} 筆，共 {totalCount} 筆訂單
          </span>
        )}
        <small className="text-muted">
          未付款共 {agingSummary.total} 筆
          {agingSummary.unknown > 0 && `，其中 ${agingSummary.unknown} 筆日期異常`}
          ；付款與健康狀態請使用上方工具列
        </small>
      </div>
    </section>
  );
};

OrderSearchToolbar.propTypes = {
  keyword: PropTypes.string.isRequired,
  dateFrom: PropTypes.string.isRequired,
  dateTo: PropTypes.string.isRequired,
  agingFilter: PropTypes.oneOf(['', 'recent', 'review', 'overdue']).isRequired,
  agingSummary: PropTypes.shape({
    total: PropTypes.number.isRequired,
    recent: PropTypes.number.isRequired,
    review: PropTypes.number.isRequired,
    overdue: PropTypes.number.isRequired,
    unknown: PropTypes.number.isRequired,
  }).isRequired,
  dateRangeError: PropTypes.string.isRequired,
  resultCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onKeywordChange: PropTypes.func.isRequired,
  onDateFromChange: PropTypes.func.isRequired,
  onDateToChange: PropTypes.func.isRequired,
  onAgingFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default OrderSearchToolbar;
