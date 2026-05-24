import { useMemo, useState } from 'react';

const DEFAULT_PER_PAGE = 12;

export const usePagination = ({ items = [], perPage = DEFAULT_PER_PAGE } = {}) => {
  const [page, setPage] = useState(1);

  // total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / perPage));
  }, [items.length, perPage]);

  // current page items
  const currentItems = useMemo(() => {
    const start = (page - 1) * perPage;

    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  // go page
  const goToPage = (targetPage) => {
    setPage(Math.min(Math.max(targetPage, 1), totalPages));
  };

  // reset page
  const resetPage = () => {
    setPage(1);
  };

  return {
    page,
    // setPage,

    totalPages,

    currentItems,

    goToPage,
    resetPage,
  };
};
