import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaSquareXTwitter, FaLine } from 'react-icons/fa6';

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

  // 登出
  const handleLogout = async () => {
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
      navigate('/', { replace: true });
    }
  };

  return (
    <footer className="footer border-top border-body py-4">
      <div className="container">
        {/* top */}
        <div className="footer__top">
          {/* left */}
          <div className="footer__left">
            {!isAuth ? (
              <Link className="footer__login-link" to="/login">
                <LogIn size={18} />
                登入後台
              </Link>
            ) : (
              <div className="footer__auth">
                <Link to="/admin" className="footer__icon-link" title="回到後台">
                  <LayoutDashboard size={18} />
                  <span>回到後台</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="footer__icon-link footer__icon-link--danger"
                  title="登出"
                >
                  <LogOut size={18} />
                  <span>登出</span>
                </button>
              </div>
            )}
          </div>

          {/* center */}
          <div className="footer__center">
            &copy; {new Date().getFullYear()} 本網站僅供個人作品使用，不提供商業用途
          </div>

          {/* right */}
          <div className="footer__right"></div>
        </div>

        {/* social */}
        <div className="footer__social">
          <a href="https://facebook.com" target="_blank" className="footer__social-link">
            <FaFacebookF size={18} />
          </a>
          <a href="https://instagram.com" target="_blank" className="footer__social-link">
            <FaInstagram size={18} />
          </a>
          <a href="https://X.com" target="_blank" className="footer__social-link">
            <FaSquareXTwitter size={18} />
          </a>
          <a href="https://line.com" target="_blank" className="footer__social-link">
            <FaLine size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FrontFooter;
