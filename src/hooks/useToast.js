import { useDispatch } from 'react-redux';
import { pushMessage } from '@/features/toast/toastSlice';

// 從toastSlice狀態中抽出
export const useToast = () => {
  const dispatch = useDispatch();

  const success = (text) => {
    dispatch(
      pushMessage({
        text,
        status: 'success',
      }),
    );
  };

  const showError = (text) => {
    dispatch(
      pushMessage({
        text,
        status: 'error',
      }),
    );
  };

  const warning = (text) => {
    dispatch(
      pushMessage({
        text,
        status: 'warning',
      }),
    );
  };

  const info = (text) => {
    dispatch(
      pushMessage({
        text,
        status: 'info',
      }),
    );
  };

  return {
    success,
    showError,
    warning,
    info,
  };
};
