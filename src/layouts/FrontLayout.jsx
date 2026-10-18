import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import AOS from 'aos';

// hooks
import { useCartInit } from '@/hooks/cart/useCartInit';
import { isFrontHeroPage } from '@/constants/frontPageConfig';

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

  const isHeroPage = isFrontHeroPage(location.pathname);

  // 避免React 路由切換的問題，AOS沒有刷新
  useEffect(() => {
    // AOS.refresh();
    AOS.refreshHard();
  }, [location.pathname]);

  return (
    <>
      <div className={`front-layout ${mode}${season}`}>
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
