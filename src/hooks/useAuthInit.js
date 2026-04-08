import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getToken } from '@/utils/auth';
import { checkAuth } from '@/services/authService';
import { loginSuccess, logoutAction } from '@/features/auth/authSlice';

import { handleApiError } from '@/utils/apiErrorHandler';
import { useToast } from '@/hooks/useToast';

export const useAuthInit = () => {
  const { showError } = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 由於沒有回傳會員名稱和權限狀態的API，userSlice先製作後暫時不使用

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();

      // 沒有 token 直接導向登入
      if (!token) {
        dispatch(logoutAction());
        // navigate('/login'); // 註解掉，避免前台以檢查並 navigate('/login');
        return;
      }

      try {
        const res = await checkAuth();

        if (res.success) {
          dispatch(
            loginSuccess({
              token,
            }),
          );
        }
      } catch (error) {
        dispatch(logoutAction());
        const errorMessage = handleApiError(error, null, '請先登入，將導向登入頁面。');
        showError(errorMessage);
        navigate('/login');
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate]);
};
