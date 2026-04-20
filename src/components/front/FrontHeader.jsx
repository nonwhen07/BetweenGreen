import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';

// features
import { logoutAction } from '@/features/auth/authSlice';
// services
import { logout } from '@/services/authService';
// hooks
import { useToast } from '@/hooks/useToast';
// components
// import Logo from '@/components/shared/Logo';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

// Header-routes
const routes = [
  { path: '/', name: 'Home' },
  { path: '/about-us', name: 'AboutUs' },
  { path: '/products', name: 'Products' },
  { path: '/cart/step1', name: 'Cart' },
  // { path: '/favorite', name: 'Favorite' },
  //   { path: '/orders', name: 'Orders' },
];

// 設定 heroPage
const heroPagePaths = ['/', '/home', '/about-us'];

const FrontHeader = () => {
  // 初始化
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isHeroPage = heroPagePaths.includes(location.pathname);
  const { success, showError } = useToast();

  const [isVisible, setIsVisible] = useState(false); // 控制背景是否顯色，有herobanner就透明化
  const [lastScrollY, setLastScrollY] = useState(0);

  const isLogin = useSelector((state) => state.auth.isLogin);
  const carts = useSelector((state) => state.cart.carts);

  //加入登出
  const handleLogout = async () => {
    try {
      await logout(); // 呼叫 API
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, '登出失敗，請稍後再試。');
      showError(errorMessage);
    }

    dispatch(logoutAction()); // 清 Redux
    success('已成功登出，將跳轉到前台首頁。');
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 往上滑：顯示背景色、往下滑：隱藏背景色 (透明)
      // 判斷條件：scroll > 50 避免在頂部過於靈敏
      if (currentScrollY > 50 && currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`navbar header ${isVisible ? 'active' : ''} ${isHeroPage ? '' : 'header-solid'}`}
      >
        <div className="container ui-container header-container">
          <ul className="navbar-nav flex-row gap-5 fs-5">
            {routes.map((route) => (
              <li key={route.path} className="nav-item">
                <NavLink className="nav-link" aria-current="page" to={route.path}>
                  {route.path.includes('cart') ? (
                    <div className="position-relative d-flex align-items-center">
                      <FaShoppingCart size={25} />
                      {carts?.length > 0 && (
                        <span
                          className={`position-absolute badge rounded-circle ${carts?.length ? 'text-bg-danger' : ''}`}
                          style={{ bottom: '17px', left: '15px', fontSize: '10px' }}
                        >
                          {carts?.length}
                        </span>
                      )}
                    </div>
                  ) : (
                    route.name
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          {/* 登入 / 登出區塊 */}
          {isLogin ? (
            <>
              <NavLink to="/dashboard" className="nav-item nav-link me-4">
                後台
              </NavLink>
              <button onClick={handleLogout} className="btn btn-link nav-item nav-link text-danger">
                登出
              </button>
            </>
          ) : (
            // <NavLink to="/login" className="nav-item nav-link text-light me-4">
            //   登入
            // </NavLink>
            <></>
          )}
        </div>
      </nav>
    </>
  );
};

export default FrontHeader;
