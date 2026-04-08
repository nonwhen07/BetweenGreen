import { Outlet } from 'react-router-dom';
import FrontHeader from '@/components/front/FrontHeader';
import FrontFooter from '@/components/front/FrontFooter';
import GoTop from '@/components/GoTop';
import { useAuthInit } from '@/hooks/useAuthInit';
import { useCartInit } from '@/hooks/useCartInit';

const FrontLayout = () => {
  // 初始化 Auth、Cart
  useAuthInit();
  useCartInit();

  const mode = 'theme-light'; // or theme-dark=>還沒設定
  // const season = 'theme-christmas';
  const season = 'theme-christmas';

  return (
    <>
      <div className={`${mode} ${season}`}>
        <FrontHeader />
        <main className="ui-layout">
          <Outlet />
        </main>
        <GoTop />
        <FrontFooter />
      </div>
    </>
  );
};
export default FrontLayout;
