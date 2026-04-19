import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import AOS from 'aos';

// hooks
import { useAuthInit } from '@/hooks/useAuthInit';

// components
import FrontHeader from '@/components/front/FrontHeader';
import FrontFooter from '@/components/front/FrontFooter';
import GoTop from '@/components/GoTop';

const FrontLayout = () => {
  // 初始化 Auth、Cart
  useAuthInit();

  const location = useLocation();

  const mode = 'theme-light'; // or theme-dark=>還沒設定
  // const season = 'theme-christmas';
  const season = '';

  // 手動列出哪些頁面「有 Hero Banner」 (所以 Header 要浮動且 Main 不要有 Padding)
  const heroPagePaths = ['/', '/home', '/about-us'];
  // 考慮到 HashRouter，我們要檢查 location.pathname
  // 或是檢查 hash 內容
  const isHeroPage = heroPagePaths.includes(location.pathname);

  // 避免React 路由切換的問題，AOS沒有刷新
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <>
      <div className={`${mode} ${season}`}>
        <FrontHeader />
        <main className={`ui-wrapper ${isHeroPage ? 'content-hero' : 'content-spacing'}`}>
          <Outlet />
        </main>
        <GoTop />
        <FrontFooter />
      </div>
    </>
  );
};
export default FrontLayout;
