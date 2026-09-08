import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// services
import { checkAuth } from '@/services/authService';
// features
import {
  authCheckStarted,
  authCheckUnavailable,
  loginSuccess,
  logoutAction,
} from '@/features/auth/authSlice';
// hooks
import { useToast } from '@/hooks/useToast';
// utils
import { clearToken, getToken } from '@/utils/auth';
import { extractErrorMessage } from '@/utils/errorHandler';

const AUTH_REJECTION_STATUS_CODES = new Set([400, 401, 403]);
const AUTH_EXPIRED_MESSAGE = '登入狀態已失效，請重新登入。';
const AUTH_UNAVAILABLE_MESSAGE = '暫時無法驗證登入狀態，請重新整理後再試。';

const isAuthRejectionError = (error) =>
  AUTH_REJECTION_STATUS_CODES.has(error?.response?.status);

export const useAuthInit = () => {
  const dispatch = useDispatch();
  const { showError, warning } = useToast();

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
          // HTTP 200 但 API 明確拒絕 token，也屬於確定失效。
          clearToken();
          dispatch(logoutAction());
          showError(res.message || AUTH_EXPIRED_MESSAGE);
          return;
        }

        if (!isActive) return;

        dispatch(
          loginSuccess({
            token,
          }),
        );
      } catch (error) {
        if (!isActive) return;

        if (isAuthRejectionError(error)) {
          clearToken();
          dispatch(logoutAction());
          showError(extractErrorMessage(error, null, AUTH_EXPIRED_MESSAGE));
          return;
        }

        // timeout、離線、429 與 5xx 等情況無法證明 token 失效：
        // 阻擋後台但保留 Cookie，讓使用者恢復連線後重新整理即可再驗證。
        console.error('Auth check unavailable:', error);
        dispatch(authCheckUnavailable(AUTH_UNAVAILABLE_MESSAGE));
        warning(AUTH_UNAVAILABLE_MESSAGE);
      }
    };

    initAuth();

    return () => {
      isActive = false;
    };
  }, [dispatch, showError, warning]);
};
