import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaTachometerAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';

// features
import { logoutAction } from '@/features/auth/authSlice';
// services
import { logout } from '@/services/authService';
// hooks
import { useToast } from '@/hooks/useToast';
// components
import Logo from '@/components/shared/Logo';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

// Header-routes
const routes = [
  // { path: '/', name: 'Home', title: '回到首頁' },
  { path: '/about-us', name: 'AboutUs', title: '關於我們', type: 'link' },
  { path: '/products', name: 'Products', title: '產品目錄', type: 'link' },
  // { path: '/cart/step1', name: 'Cart, title: '回到首頁'' },
  // { path: '/favorite', name: 'Favorite', title: '回到首頁' },
  // { path: '/orders', name: 'Orders', title: '歷史' },
];
// const routeActions = [
//   { path: '/cart/step1', name: 'Cart', title: '購物車', icon: FaShoppingCart, type: 'link' },
//   // {
//   //   path: '/member-center',
//   //   name: 'MemberCenter',
//   //   title: '會員中心',
//   //   icon: FaUsers,
//   //   type: 'link',
//   //   auth: true,
//   // },
//   // {
//   //   path: '/dashboard',
//   //   name: 'Dashboard',
//   //   title: '回到後台',
//   //   icon: FaTachometerAlt,
//   //   type: 'link',
//   //   auth: true,
//   // },
//   // {
//   //   path: '/logout',
//   //   name: 'Logout',
//   //   title: '登出',
//   //   icon: FaSignOutAlt,
//   //   type: 'btn',
//   //   auth: true,
//   // },
// ];

// 設定 heroPage
const heroPagePaths = ['/', '/home', '/about-us'];

const FrontHeader = () => {
  // 初始化
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isHeroPage = heroPagePaths.includes(location.pathname);
  const { success, showError } = useToast();

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
      <nav className={` navbar header ${isHeroPage ? `header--${scrollState}` : 'header--solid'}`}>
        <div className="container ui-container header__content">
          {/* brand */}
          <div className="header__brand">
            <Logo variant={isHeroPage ? 'light' : 'muted'} />
          </div>
          {/* nav */}
          <ul className="navbar-nav header__nav flex-row gap-5 fs-5">
            {routes.map((route) => (
              <li key={route.path} className="nav-item header__item">
                <NavLink
                  className="nav-link header__link"
                  aria-current="page"
                  to={route.path}
                  title={route.title}
                >
                  {route.name}
                </NavLink>
              </li>
            ))}
          </ul>
          {/* actions */}
          <div className="header__actions">
            {/* <div className="position-relative">
              <ul className="navbar-nav header__nav flex-row gap-5 fs-5">
                {routeActions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.path} className="nav-item header__item">
                      <NavLink
                        className="nav-link header__link header__icon"
                        aria-current="page"
                        to={item.path}
                        title={item.title}
                      >
                        {item.path.includes('cart') ? (
                          <div className="position-relative d-flex align-items-center">
                            <Icon size={25} />
                            {carts?.length > 0 && (
                              <span
                                className={`position-absolute badge header__badge rounded-circle ${carts?.length ? 'text-bg-danger' : ''}`}
                                style={{ bottom: '17px', left: '15px', fontSize: '10px' }}
                              >
                                {carts?.length}
                              </span>
                            )}
                          </div>
                        ) : (
                          <Icon className="me-2" size={25} />
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div> */}

            <ul className="header__action-list">
              <li className="header__item">
                <NavLink to="/cart/step1" className="header__link header__icon" title="購物車">
                  <FaShoppingCart size={22} />
                  {carts?.length > 0 && <span className="header__badge">{carts.length}</span>}
                </NavLink>
              </li>
            </ul>

            {/* auth  */}
            {isLogin && (
              <div className="header__auth">
                <NavLink to="/dashboard" className="header__icon" title="後台">
                  <FaTachometerAlt size={22} />
                </NavLink>

                <button type="button" onClick={handleLogout} className="header__icon" title="登出">
                  <FaSignOutAlt size={22} />
                </button>
              </div>
            )}
          </div>
          {/* toggle */}
          <button className="header__toggle">☰</button>
        </div>
      </nav>
    </>
  );
};

export default FrontHeader;
