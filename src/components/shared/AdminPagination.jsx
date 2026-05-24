import clsx from 'clsx';
import PropTypes from 'prop-types';

{
  /* 使用方式: <AdminPagination pageInfo={pageInfo} onPageChange={handlePageChange} />; */
}

const AdminPagination = ({ pageInfo, onPageChange }) => {
  if (!pageInfo || pageInfo.total_pages <= 1) {
    return null;
  }

  const { current_page, total_pages, has_pre, has_next } = pageInfo;

  return (
    <nav className="admin-pagination" aria-label="Pagination">
      {/* prev */}
      <button
        type="button"
        className="admin-pagination__item"
        disabled={!has_pre}
        onClick={() => onPageChange(current_page - 1)}
      >
        ‹
      </button>

      {/* page numbers */}
      {Array.from({ length: total_pages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          type="button"
          className={clsx('admin-pagination__item', current_page === pageNum && 'is-active')}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}

      {/* next */}
      <button
        type="button"
        className="admin-pagination__item"
        disabled={!has_next}
        onClick={() => onPageChange(current_page + 1)}
      >
        ›
      </button>
    </nav>
  );
};

AdminPagination.propTypes = {
  pageInfo: PropTypes.object,
  onPageChange: PropTypes.func.isRequired,
};

export default AdminPagination;
