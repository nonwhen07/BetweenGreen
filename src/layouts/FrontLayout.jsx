import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import AOS from 'aos';

// hooks
import { useCartInit } from '@/hooks/cart/useCartInit';

// components
import FrontHeader from '@/components/front/FrontHeader';
import FrontFooter from '@/components/front/FrontFooter';
import ScrollToTop from '@/components/shared/ScrollToTop';
import GoTop from '@/components/shared/GoTop';

const FrontLayout = () => {
  // 初始化 Cart 狀態；Auth 由 App 統一初始化。
  useCartInit();

  const location = useLocation();

  const mode = 'theme-light'; // or theme-dark=>還沒設定
  // const season = 'theme-christmas';
  const season = '';

  // 手動列出哪些頁面「有 Hero Banner」 (所以 Header 要浮動且 Main 不要有 Padding)
  // const heroPagePaths = ['/', '/home', '/about-us'];
  // const heroPagePaths = ['/', '/home', '/about-us', '/products', '/articles']; // 之後可以改 API 或是用路由 meta 來判斷
  const heroPagePaths = ['/', '/home', '/about-us', '/products']; //先讓/articles 不要套用hero版面，因為還沒確定hero風格
  // 考慮到 HashRouter，我們要檢查 location.pathname
  // 或是檢查 hash 內容
  const isHeroPage = heroPagePaths.includes(location.pathname);

  // 避免React 路由切換的問題，AOS沒有刷新
  useEffect(() => {
    // AOS.refresh();
    AOS.refreshHard();
  }, [location.pathname]);

  return (
    <>
      <div className={`${mode}${season}`}>
        <ScrollToTop />
        <FrontHeader />
        <main className={`ui-wrapper ${isHeroPage ? 'ui-wrapper-hero' : 'ui-wrapper-spacing'}`}>
          <Outlet />
        </main>
        <GoTop variant="front" />
        <FrontFooter />
      </div>
    </>
  );
};
export default FrontLayout;
