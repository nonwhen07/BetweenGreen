import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// services
import { checkAuth } from '@/services/authService';
// features
import {
  authCheckStarted,
  loginSuccess,
  logoutAction,
} from '@/features/auth/authSlice';
// hooks
import { useToast } from '@/hooks/useToast';
// utils
import { clearToken, getToken } from '@/utils/auth';
import { extractErrorMessage } from '@/utils/errorHandler';

export const useAuthInit = () => {
  const dispatch = useDispatch();
  const { showError } = useToast();

  // 由於沒有回傳會員名稱和權限狀態的API，userSlice先製作後暫時不使用

  useEffect(() => {
    let isActive = true;

    const initAuth = async () => {
      dispatch(authCheckStarted());

      const token = getToken();

      // 沒有 token：完成初始化；導向登入由 AdminLayout guard 負責。
      if (!token) {
        if (isActive) dispatch(logoutAction());
        return;
      }

      try {
        const res = await checkAuth();

        if (!res.success) {
          throw new Error(res.message || '登入狀態已失效');
        }

        if (!isActive) return;

        dispatch(
          loginSuccess({
            token,
          }),
        );
      } catch (error) {
        if (!isActive) return;

        clearToken();
        dispatch(logoutAction());
        const errorMessage = extractErrorMessage(
          error,
          null,
          '登入狀態已失效，請重新登入。',
        );
        showError(errorMessage);
      }
    };

    initAuth();

    return () => {
      isActive = false;
    };
  }, [dispatch, showError]);
};
