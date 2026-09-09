import { useCallback, useMemo, useState } from 'react';

const DEFAULT_PER_PAGE = 12;

export const usePagination = ({ items = [], perPage = DEFAULT_PER_PAGE } = {}) => {
  // total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / perPage));
  }, [items.length, perPage]);

  const [paginationState, setPaginationState] = useState({
    page: 1,
    totalPages,
  });

  // totalPages 由 items 衍生；若刪除資料使末頁消失，在本次 render
  // 立即校正 state，不必等 Effect 再觸發第二段同步流程。
  if (paginationState.totalPages !== totalPages) {
    setPaginationState({
      page: Math.min(paginationState.page, totalPages),
      totalPages,
    });
  }

  const page =
    paginationState.totalPages === totalPages
      ? paginationState.page
      : Math.min(paginationState.page, totalPages);

  // current page items
  const currentItems = useMemo(() => {
    const start = (page - 1) * perPage;

    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  // go page
  const goToPage = useCallback(
    (targetPage) => {
      setPaginationState((currentState) => ({
        ...currentState,
        page: Math.min(Math.max(targetPage, 1), totalPages),
      }));
    },
    [totalPages],
  );

  // reset page
  const resetPage = useCallback(() => {
    setPaginationState((currentState) => ({
      ...currentState,
      page: 1,
    }));
  }, []);

  return {
    page,
    // setPage,

    totalPages,

    currentItems,

    goToPage,
    resetPage,
  };
};
