import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaBars, FaShoppingCart, FaTachometerAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import Collapse from 'bootstrap/js/dist/collapse';

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

  // 關閉 menu（點擊遮罩或選單連結後）
  const closeMenu = () => {
    const collapseEl = document.getElementById('headerMenu');
    if (!collapseEl) return;

    let bsCollapse = Collapse.getInstance(collapseEl);

    if (!bsCollapse) {
      bsCollapse = new Collapse(collapseEl, {
        toggle: false,
      });
    }

    bsCollapse.hide();
  };

  useEffect(() => {
    const collapseEl = document.getElementById('headerMenu');
    const overlayEl = document.querySelector('.header__overlay');

    if (!collapseEl) return;

    // 處理手機選單開啟時的 scroll 鎖定與解鎖
    const lockScroll = () => {
      const scrollY = window.scrollY;

      document.body.classList.add('is-locked'); // 用 class 控
      document.body.style.top = `-${scrollY}px`;
    };

    const unlockScroll = () => {
      const scrollY = document.body.style.top;

      document.body.classList.remove('is-locked');
      document.body.style.top = '';

      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };

    // 展開
    const handleShow = () => {
      overlayEl?.classList.add('show');
      lockScroll();
    };

    // 收合
    const handleHide = () => {
      overlayEl?.classList.remove('show');
      unlockScroll();
    };

    collapseEl.addEventListener('shown.bs.collapse', handleShow);
    collapseEl.addEventListener('hidden.bs.collapse', handleHide);

    return () => {
      collapseEl.removeEventListener('shown.bs.collapse', handleShow);
      collapseEl.removeEventListener('hidden.bs.collapse', handleHide);
    };
  }, []);

  useEffect(() => {
    const collapseEl = document.getElementById('headerMenu');
    if (!collapseEl) return;

    let bsCollapse = Collapse.getInstance(collapseEl);

    if (!bsCollapse) {
      bsCollapse = new Collapse(collapseEl, {
        toggle: false,
      });
    }

    bsCollapse.hide();
  }, [location.pathname]);

  return (
    <>
      <nav className={`navbar header ${isHeroPage ? `header--${scrollState}` : 'header--solid'}`}>
        <div className="container ui-container header__content">
          {/* brand */}
          <div className="header__brand">
            {/* variant={isHeroPage ? 'light' : 'muted'} */}
            <Logo />
          </div>
          {/* toggle */}
          <button
            className="btn header__toggle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#headerMenu"
            aria-controls="headerMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <FaBars size={22} />
          </button>
          {/* collapse */}
          <div className="collapse header__collapse" id="headerMenu">
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
                    {carts?.length > 0 && <span className="header__badge">{carts.length}</span>}
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
                    onClick={handleLogout, closeMenu}
                    className="header__icon"
                    title="登出"
                  >
                    <FaSignOutAlt size={22} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* overlay */}
      <div className="header__overlay" onClick={closeMenu}></div>
      {/* <div className="header__overlay" /> */}
    </>
  );
};

export default FrontHeader;
