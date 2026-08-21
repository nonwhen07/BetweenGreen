import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { pushMessage } from '@/features/ui/toastSlice';

// 從toastSlice狀態中抽出
export const useToast = () => {
  const dispatch = useDispatch();

  const success = useCallback(
    (text) => {
      dispatch(
        pushMessage({
          text,
          status: 'success',
        }),
      );
    },
    [dispatch],
  );

  const showError = useCallback(
    (text) => {
      dispatch(
        pushMessage({
          text,
          status: 'error',
        }),
      );
    },
    [dispatch],
  );

  const warning = useCallback(
    (text) => {
      dispatch(
        pushMessage({
          text,
          status: 'warning',
        }),
      );
    },
    [dispatch],
  );

  const info = useCallback(
    (text) => {
      dispatch(
        pushMessage({
          text,
          status: 'info',
        }),
      );
    },
    [dispatch],
  );

  return {
    success,
    showError,
    warning,
    info,
  };
};
