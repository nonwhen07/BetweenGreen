import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AOS from 'aos';

// hooks
import { useAuthInit } from '@/hooks/auth/useAuthInit';

// components
// import PageLoader from '@/components/shared/PageLoader';
import AdminAside from '@/components/admin/AdminAside';
import AdminHeader from '@/components/admin/AdminHeader';
import GoTop from '@/components/shared/GoTop';

const AdminLayout = () => {
  // Custom Hook = 可重用的「邏輯」，而不是 UI。
  // 判斷邏輯：① 有 useState / useEffect / useMemo / useCallback
  // ② 跟 UI 無關、③ 可能在別的頁面也會用、④ 讓 Component 太長，所以這段可以抽出去當 Custom Hook
  // 初始化登入狀態
  useAuthInit();

  // 避免React 路由切換的問題，AOS沒有刷新
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <>
      <div className="admin">
        <div className="admin-layout">
          <AdminHeader />
          <div className="admin-wrapper">
            <AdminAside />
            <main className="admin-main">
              <div className="admin-content">
                <Outlet />
              </div>
            </main>
          </div>
          <GoTop />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
