import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaBars,
  FaBox,
  FaShoppingCart,
  FaTachometerAlt,
  FaUsers,
  FaSignOutAlt,
  FaCreditCard,
} from 'react-icons/fa';

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
  {
    path: '/about-us',
    name: 'AboutUs',
    title: '關於我們',
    label: '關於我們',
    type: 'link',
    showInNav: true,
  },
  {
    path: '/products',
    name: 'Products',
    title: '產品目錄',
    label: '產品目錄',
    type: 'link',
    showInNav: true,
  },
  // { path: '/favorite', name: 'Favorite', title: '回到首頁' },
  // { path: '/orders', name: 'Orders', title: '歷史' },
];
const menuItems = [
  {
    type: 'link',
    path: '/about-us',
    label: '關於我們',
    icon: FaUsers,
  },
  {
    type: 'link',
    path: '/products',
    label: '產品目錄',
    icon: FaBox,
  },
  {
    type: 'action',
    path: '/cart/step1',
    label: '購物車',
    icon: FaShoppingCart,
  },
  {
    type: 'action',
    path: '/dashboard',
    label: '後台',
    icon: FaTachometerAlt,
    auth: true,
  },
];

const FrontHeader = () => {
  // 初始化
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // const isHeroPage = heroPagePaths.includes(location.pathname);
  const isHeroPage = location.pathname === '/' || location.pathname.startsWith('/about-us');

  const { success, showError } = useToast();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const [lastScrollY, setLastScrollY] = useState(0);

  const isLogin = useSelector((state) => state.auth.isLogin);
  const carts = useSelector((state) => state.cart.carts);
  const cartCount = carts?.length || 0;

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

  // 關閉 menu（點擊遮罩或選單連結後）
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (!isHeroPage) return; // 直接關掉

    const handleScroll = () => {
      const currentY = window.scrollY;
      let nextState = 'down';

      if (currentY <= 150) {
        nextState = 'top';
      } else if (currentY < lastScrollY) {
        nextState = 'active';
      }

      setScrollState((prev) => (prev !== nextState ? nextState : prev));
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHeroPage, lastScrollY]);

  useEffect(() => {
    // const lockScroll = () => {
    //   const scrollY = window.scrollY;
    //   const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    //   document.body.style.top = `-${scrollY}px`;
    //   document.body.style.position = 'fixed';
    //   document.body.style.width = '100%';
    //   document.body.style.paddingRight = `${scrollbarWidth}px`; // ⭐

    //   document.body.classList.add('is-locked');
    // };

    // const unlockScroll = () => {
    //   const scrollY = document.body.style.top;

    //   document.body.style.position = '';
    //   document.body.style.top = '';
    //   document.body.style.width = '';
    //   document.body.style.paddingRight = '';

    //   document.body.classList.remove('is-locked');

    //   window.scrollTo(0, parseInt(scrollY || '0') * -1);
    // };

    if (isMenuOpen) {
      // lockScroll();
      document.body.classList.add('is-locked');
    } else {
      // unlockScroll();
      document.body.classList.remove('is-locked');
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`navbar header ${isHeroPage ? `header--scroll-${scrollState}` : 'header--solid'}`}
      >
        <div className="container ui-container header__content">
          {/* brand */}
          <div className="header__brand">
            {/* variant={isHeroPage ? 'light' : 'muted'} */}
            <Logo />
          </div>
          {/* toggle */}
          <button
            className={`btn header__toggle${!isMenuOpen ? ' collapsed' : ''}`}
            type="button"
            aria-controls="headerMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="header__bar"></span>
            <span className="header__bar"></span>
            <span className="header__bar"></span>
          </button>
          {/* header__menu */}
          <div className={`header__menu${isMenuOpen ? ' is-open' : ''}`} id="headerMenu">
            {/* nav */}
            <ul className="navbar-nav header__nav">
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
              <ul className="header__action-list">
                <li className="header__item">
                  <NavLink
                    to="/cart/step1"
                    className="header__link header__icon"
                    title="購物車"
                    onClick={closeMenu}
                  >
                    <FaShoppingCart size={22} />
                    {cartCount > 0 && <span className="header__badge">{cartCount}</span>}
                  </NavLink>
                </li>
              </ul>

              {/* auth  */}
              {isLogin && (
                <div className="header__auth">
                  <NavLink
                    to="/dashboard"
                    className="header__icon"
                    title="後台"
                    onClick={closeMenu}
                  >
                    <FaTachometerAlt size={22} />
                  </NavLink>

                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="header__icon header__link--danger"
                    title="登出"
                  >
                    <FaSignOutAlt size={22} />
                  </button>
                </div>
              )}
            </div>
            {/* menu-list */}
            <ul className="header__menu-list">
              {menuItems.map((item, index) => {
                if (item.auth && !isLogin) return null;

                const Icon = item.icon;

                return (
                  <li key={item.path + index} className="header__item" style={{ '--i': index }}>
                    <NavLink
                      to={item.path}
                      title={item.label}
                      className="header__link"
                      onClick={closeMenu}
                    >
                      <div className="header__icon me-3">
                        {Icon && <Icon size={25} />}
                        {item.path === '/cart/step1' && cartCount > 0 && (
                          <span className="header__badge">{cartCount}</span>
                        )}
                      </div>

                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
              {isLogin && (
                <li className="header__item">
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="header__link"
                    title="登出"
                  >
                    <FaSignOutAlt size={22} />
                    <span className="ms-2">登出</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {/* overlay */}
      <div className={`header__overlay${isMenuOpen ? ' is-active' : ''}`} onClick={closeMenu}></div>
    </>
  );
};

export default FrontHeader;
