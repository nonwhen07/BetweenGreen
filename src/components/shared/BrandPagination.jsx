import clsx from 'clsx';
import PropTypes from 'prop-types';

const BrandPagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
  ariaLabel = '分頁導覽',
}) => {
  if (totalPages <= 1) return null;

  return (
    <nav className={clsx('brand-pagination', className)} aria-label={ariaLabel}>
      <button
        type="button"
        className="brand-pagination__item"
        disabled={currentPage <= 1}
        aria-label="上一頁"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
      >
        ‹
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => {
        const isActive = currentPage === pageNum;

        return (
          <button
            key={pageNum}
            type="button"
            className={clsx('brand-pagination__item', isActive && 'is-active')}
            aria-label={`第 ${pageNum} 頁`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        type="button"
        className="brand-pagination__item"
        disabled={currentPage >= totalPages}
        aria-label="下一頁"
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
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default BrandPagination;
