import { useState, useEffect } from 'react';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Package, ShoppingCart, ReceiptText, LayoutDashboard, Users } from 'lucide-react';
// components
import Logo from '@/components/shared/Logo';
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
    activePatterns: ['/product/:product_id'],
    name: 'Products',
    title: '產品目錄',
    label: '產品目錄',
    type: 'link',
    showInNav: true,
  },
  {
    path: '/customer-orders',
    name: 'CustomerOrders',
    title: '歷次訂單',
    label: '歷次訂單',
    type: 'link',
    showInNav: true,
  },
  // { path: '/favorite', name: 'Favorite', title: '回到首頁' },
];
const menuItems = [
  {
    type: 'link',
    path: '/about-us',
    label: '關於我們',
    icon: Users,
  },
  {
    type: 'link',
    path: '/products',
    activePatterns: ['/product/:product_id'],
    label: '產品目錄',
    icon: Package,
  },
  {
    type: 'action',
    path: '/cart/step1',
    label: '購物車',
    icon: ShoppingCart,
  },
  {
    type: 'link',
    path: '/customer-orders',
    label: '歷次訂單',
    icon: ReceiptText,
  },
  {
    type: 'action',
    path: '/admin',
    label: '回到後台首頁',
    icon: LayoutDashboard,
    auth: true,
  },
];

const isRouteSectionActive = (item, pathname) => {
  return item.activePatterns?.some((pattern) =>
    matchPath({ path: pattern, end: true }, pathname),
  );
};

const FrontHeader = () => {
  const location = useLocation();

  // const isHeroPage = location.pathname === '/' || location.pathname.startsWith('/about-us');
  const heroPagePaths = ['/', '/home', '/about-us', '/products'];
  const isHeroPage = heroPagePaths.includes(location.pathname);
  const isCartFlowRoute = /^\/cart\/step[1-3]\/?$/.test(location.pathname);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const [lastScrollY, setLastScrollY] = useState(0);

  const isAuth = useSelector((state) => state.auth.isAuth);
  const carts = useSelector((state) => state.cart.carts);
  const cartCount = carts?.length || 0;

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
              {routes.map((route) => {
                const isSectionActive = isRouteSectionActive(route, location.pathname);

                return (
                  <li key={route.path} className="nav-item header__item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link header__link${isActive || isSectionActive ? ' is-active' : ''}`
                      }
                      aria-current={isSectionActive ? 'page' : undefined}
                      to={route.path}
                      title={route.title}
                      onClick={closeMenu}
                    >
                      {route.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
            {/* actions */}
            <div className="header__actions">
              <ul className="header__action-list">
                <li className="header__item">
                  <NavLink
                    to="/cart/step1"
                    className={({ isActive }) =>
                      `header__link header__icon${
                        isActive || isCartFlowRoute ? ' is-active' : ''
                      }`
                    }
                    aria-current={isCartFlowRoute ? 'page' : undefined}
                    title="購物車"
                    onClick={closeMenu}
                  >
                    <ShoppingCart size={20} strokeWidth={1.9} />
                    {cartCount > 0 && <span className="header__badge">{cartCount}</span>}
                  </NavLink>
                </li>
              </ul>
            </div>
            {/* menu-list */}
            <ul className="header__menu-list">
              {menuItems.map((item, index) => {
                if (item.auth && !isAuth) return null;

                const Icon = item.icon;
                const isSectionActive = isRouteSectionActive(item, location.pathname);
                const isCartSectionActive = item.path === '/cart/step1' && isCartFlowRoute;

                return (
                  <li key={item.path + index} className="header__item" style={{ '--i': index }}>
                    <NavLink
                      to={item.path}
                      title={item.label}
                      className={({ isActive }) =>
                        `header__link${
                          isActive || isSectionActive || isCartSectionActive
                            ? ' is-active'
                            : ''
                        }`
                      }
                      aria-current={
                        isSectionActive || isCartSectionActive ? 'page' : undefined
                      }
                      onClick={closeMenu}
                    >
                      <div className="header__icon me-3">
                        {Icon && <Icon size={22} strokeWidth={1.9} />}
                        {item.path === '/cart/step1' && cartCount > 0 && (
                          <span className="header__badge">{cartCount}</span>
                        )}
                      </div>

                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
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
