import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaSquareXTwitter, FaLine } from 'react-icons/fa6';

// features
import { logoutAction } from '@/features/auth/authSlice';
// services
import { logout } from '@/services/authService';
// hooks
import { useToast } from '@/hooks/useToast';
// utils
import { clearToken } from '@/utils/auth';

const FrontFooter = () => {
  // 初始化
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const { success, warning } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 登出
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const response = await logout();

      if (!response.success) {
        throw new Error(response.message || '伺服器未完成登出');
      }

      success('已成功登出，將跳轉到前台首頁。');
    } catch (error) {
      console.error('Logout failed:', error);
      warning('伺服器登出未完成，但已清除本機登入狀態。');
    } finally {
      // 即使伺服器無回應，仍保證前端立即退出登入狀態。
      clearToken();
      dispatch(logoutAction());
      setIsLoggingOut(false);
      navigate('/', { replace: true });
    }
  };

  return (
    <footer className="front-footer">
      <div className="ui-container front-footer__content">
        {/* top */}
        <div className="front-footer__top">
          {/* left */}
          <div className="front-footer__left">
            {!isAuth ? (
              <Link className="front-footer__login-link" to="/login">
                <LogIn size={18} />
                登入後台
              </Link>
            ) : (
              <div className="front-footer__auth">
                <Link to="/admin" className="front-footer__icon-link" title="回到後台">
                  <LayoutDashboard size={18} />
                  <span>回到後台</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="front-footer__icon-link front-footer__icon-link--danger"
                  title="登出"
                >
                  <LogOut size={18} />
                  <span>{isLoggingOut ? '登出中…' : '登出'}</span>
                </button>
              </div>
            )}
          </div>

          {/* center */}
          <div className="front-footer__center">
            &copy; {new Date().getFullYear()} 本網站僅供個人作品使用，不提供商業用途
          </div>

          {/* 原 footer__right 僅用來佔位，改由 Sass grid 保留對稱欄，不再放空節點。 */}
        </div>

        {/* social */}
        <nav className="front-footer__social" aria-label="社群連結">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook（另開分頁）" className="front-footer__social-link">
            <FaFacebookF size={18} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram（另開分頁）" className="front-footer__social-link">
            <FaInstagram size={18} />
          </a>
          <a href="https://X.com" target="_blank" rel="noopener noreferrer" aria-label="X（另開分頁）" className="front-footer__social-link">
            <FaSquareXTwitter size={18} />
          </a>
          <a href="https://line.com" target="_blank" rel="noopener noreferrer" aria-label="LINE（另開分頁）" className="front-footer__social-link">
            <FaLine size={18} />
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default FrontFooter;
