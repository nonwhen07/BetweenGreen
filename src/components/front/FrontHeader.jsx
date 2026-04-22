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

  // const [isVisible, setIsVisible] = useState(false); // 控制背景是否顯色，有herobanner就透明化
  const [scrollState, setScrollState] = useState('scroll-top');
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
    if (!isHeroPage) return; // 直接關掉

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Top 狀態（最高優先）
      if (currentScrollY <= 150) {
        setScrollState('top');
      }
      // 2️. 往上滑
      else if (currentScrollY < lastScrollY) {
        setScrollState('active');
      }
      // 3️. 往下滑
      else {
        setScrollState('hidden');
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHeroPage, lastScrollY]);

  return (
    <>
      <nav className={`navbar header ${isHeroPage ? `header--${scrollState}` : 'header--solid'}`}>
        <div className="container ui-container header__container">
          <ul className="navbar-nav header__nav flex-row gap-5 fs-5">
            {routes.map((route) => (
              <li key={route.path} className="nav-item header__item">
                <NavLink className="nav-link header__link" aria-current="page" to={route.path}>
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
              <div className="nav-item header__item">
                <NavLink to="/dashboard" className="nav-link header__link header__link me-4">
                  後台
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="btn btn-link nav-link header__link text-danger"
                >
                  登出
                </button>
              </div>
            </>
          ) : (
            ''
          )}
        </div>
      </nav>
    </>
  );
};

export default FrontHeader;
