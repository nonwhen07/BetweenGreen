import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AOS from 'aos';

// hooks
import { useAuthInit } from '@/hooks/useAuthInit';
import { useCartInit } from '@/hooks/useCartInit';

// components
import FrontHeader from '@/components/front/FrontHeader';
import FrontFooter from '@/components/front/FrontFooter';
import GoTop from '@/components/GoTop';

const FrontLayout = () => {
  // 初始化 Auth、Cart
  useAuthInit();
  useCartInit();

  const mode = 'theme-light'; // or theme-dark=>還沒設定
  // const season = 'theme-christmas';
  const season = '';

  // 避免React 路由切換的問題，AOS沒有刷新
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <>
      <div className={`${mode} ${season}`}>
        <FrontHeader />
        <main className="ui-wrapper">
          <Outlet />
        </main>
        <GoTop />
        <FrontFooter />
      </div>
    </>
  );
};
export default FrontLayout;
