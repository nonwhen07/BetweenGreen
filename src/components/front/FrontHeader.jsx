import { useCallback, useEffect, useRef, useState } from 'react';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BookOpenText, LayoutDashboard, Package, ReceiptText, ShoppingCart, Users } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { BREAKPOINTS } from '@/constants/breakpoints';
import { isFrontHeroPage } from '@/constants/frontPageConfig';

// 桌機／手機共用入口；詳情頁只亮所屬入口，不新增導覽項目。
const menuItems = [
  { path: '/about-us', label: '關於我們', icon: Users, desktop: true },
  { path: '/products', label: '產品目錄', icon: Package, desktop: true, activePatterns: ['/product/:product_id'] },
  { path: '/articles', label: '植栽筆記', icon: BookOpenText, desktop: true, activePatterns: ['/article/:article_id'] },
  { path: '/cart/step1', label: '購物車', icon: ShoppingCart, activePatterns: ['/cart/step1', '/cart/step2', '/cart/step3'] },
  { path: '/customer-orders', label: '歷次訂單', icon: ReceiptText, desktop: true },
  { path: '/admin', label: '回到後台首頁', icon: LayoutDashboard, auth: true },
];

const isRouteSectionActive = (item, pathname) =>
  item.activePatterns?.some((path) => matchPath({ path, end: true }, pathname));

const FrontHeader = () => {
  const location = useLocation();
  const isHeroPage = isFrontHeroPage(location.pathname);
  const [menuRouteKey, setMenuRouteKey] = useState(null);
  const isMenuOpen = menuRouteKey === location.key;
  const [scroll, setScroll] = useState({ routeKey: null, value: 'top' });
  const scrollState = scroll.routeKey === location.key ? scroll.value : 'top';
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const carts = useSelector((state) => state.cart.carts);
  const cartCount = carts?.length || 0;
  const closeMenu = useCallback(() => setMenuRouteKey(null), []);

  useBodyScrollLock(isMenuOpen);

  useEffect(() => {
    // 路由立即讓抽屜失效，再清掉舊 key，避免返回歷史頁面時重開。
    const frame = window.requestAnimationFrame(closeMenu);
    return () => window.cancelAnimationFrame(frame);
  }, [location.key, closeMenu]);

  useEffect(() => {
    if (!isHeroPage) return undefined;
    let previousY = window.scrollY;
    const handleScroll = () => {
      const currentY = Math.max(0, window.scrollY);
      const value = currentY <= 150 ? 'top' : currentY < previousY ? 'active' : 'down';
      previousY = currentY;
      setScroll((previous) =>
        previous.routeKey === location.key && previous.value === value
          ? previous
          : { routeKey: location.key, value },
      );
    };
    const frame = window.requestAnimationFrame(handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHeroPage, location.key]);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${BREAKPOINTS.desktop}px)`);
    const handleChange = (event) => {
      if (event.matches) closeMenu();
    };
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, [closeMenu]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const toggle = toggleRef.current;
    const getControls = () => [toggle, ...menuRef.current.querySelectorAll('a[href]')].filter(Boolean);
    const frame = window.requestAnimationFrame(() => getControls()[1]?.focus());
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
      }
      if (event.key !== 'Tab') return;
      const controls = getControls();
      const first = controls[0];
      const last = controls.at(-1);
      const active = document.activeElement;
      if (!controls.includes(active) || (event.shiftKey && active === first) || (!event.shiftKey && active === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      if (toggle?.isConnected && toggle.getClientRects().length) toggle.focus();
    };
  }, [isMenuOpen, closeMenu]);

  const renderLink = (item, mobile = false) => {
    const Icon = item.icon;
    const isSectionActive = isRouteSectionActive(item, location.pathname);
    return (
      <NavLink
        to={item.path}
        title={item.label}
        className={({ isActive }) => `front-header__link${isActive || isSectionActive ? ' is-active' : ''}`}
        aria-current={isSectionActive ? 'page' : undefined}
        onClick={closeMenu}
      >
        {mobile && (
          <span className="front-header__icon" aria-hidden="true">
            <Icon size={22} strokeWidth={1.9} />
            {item.path === '/cart/step1' && cartCount > 0 && <span className="front-header__badge">{cartCount}</span>}
          </span>
        )}
        {item.label}
      </NavLink>
    );
  };
  const cartItem = menuItems.find((item) => item.path === '/cart/step1');

  return (
    <>
      <header className={`front-header ${isHeroPage && !isMenuOpen ? `front-header--scroll-${scrollState}` : 'front-header--solid'}`}>
        <div className="front-header__content">
          <div className="front-header__brand"><Logo /></div>
          <nav className="front-header__desktop" aria-label="主要導覽">
            <ul className="front-header__nav">
              {menuItems.filter((item) => item.desktop).map((item) => (
                <li key={item.path}>{renderLink(item)}</li>
              ))}
            </ul>
            <NavLink
              to={cartItem.path}
              className={({ isActive }) => `front-header__link front-header__icon${isActive || isRouteSectionActive(cartItem, location.pathname) ? ' is-active' : ''}`}
              aria-current={isRouteSectionActive(cartItem, location.pathname) ? 'page' : undefined}
              aria-label={`購物車${cartCount > 0 ? `，${cartCount} 項商品` : ''}`}
              title="購物車"
            >
              <ShoppingCart size={20} strokeWidth={1.9} aria-hidden="true" />
              {cartCount > 0 && <span className="front-header__badge" aria-hidden="true">{cartCount}</span>}
            </NavLink>
          </nav>
          <button
            ref={toggleRef}
            className={`front-header__toggle${isMenuOpen ? ' is-open' : ''}`}
            type="button"
            aria-controls="frontHeaderMenu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? '關閉導覽選單' : '開啟導覽選單'}
            onClick={() => setMenuRouteKey(isMenuOpen ? null : location.key)}
          >
            <span className="front-header__bar" aria-hidden="true" />
            <span className="front-header__bar" aria-hidden="true" />
            <span className="front-header__bar" aria-hidden="true" />
          </button>
          <nav
            ref={menuRef}
            className={`front-header__menu${isMenuOpen ? ' is-open' : ''}`}
            id="frontHeaderMenu"
            aria-label="手機導覽"
            inert={!isMenuOpen}
          >
            <ul className="front-header__menu-list">
              {menuItems.filter((item) => !item.auth || isAuth).map((item, index) => (
                <li key={item.path} className="front-header__item" style={{ '--i': index }}>{renderLink(item, true)}</li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <div className={`front-header__overlay${isMenuOpen ? ' is-active' : ''}`} onClick={closeMenu} aria-hidden="true" />
    </>
  );
};

export default FrontHeader;
