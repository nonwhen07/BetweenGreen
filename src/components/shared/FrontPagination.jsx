import clsx from 'clsx';
import PropTypes from 'prop-types';

const BrandPagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="brand-pagination" aria-label="Pagination">
      {/* prev */}
      <button
        type="button"
        className="brand-pagination__item"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
      >
        ‹
      </button>

      {/* pages */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          type="button"
          className={clsx('brand-pagination__item', currentPage === pageNum && 'is-active')}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}

      {/* next */}
      <button
        type="button"
        className="brand-pagination__item"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      >
        ›
      </button>
    </nav>
  );
};

BrandPagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
};

export default BrandPagination;
