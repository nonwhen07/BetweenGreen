import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_PER_PAGE = 12;

export const usePagination = ({ items = [], perPage = DEFAULT_PER_PAGE } = {}) => {
  const [page, setPage] = useState(1);

  // total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / perPage));
  }, [items.length, perPage]);

  const safePage = Math.min(page, totalPages);

  // current page items
  const currentItems = useMemo(() => {
    const start = (safePage - 1) * perPage;

    return items.slice(start, start + perPage);
  }, [items, perPage, safePage]);

  // 刪除目前頁最後一筆資料時，自動退回仍存在的最後一頁。
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // go page
  const goToPage = useCallback(
    (targetPage) => {
      setPage(Math.min(Math.max(targetPage, 1), totalPages));
    },
    [totalPages],
  );

  // reset page
  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page: safePage,
    // setPage,

    totalPages,

    currentItems,

    goToPage,
    resetPage,
  };
};
