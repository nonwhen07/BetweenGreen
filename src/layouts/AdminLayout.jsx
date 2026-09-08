import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AOS from 'aos';

// hooks
import useBodyScrollLock from '@/hooks/useBodyScrollLock';

// components
import PageLoader from '@/components/shared/PageLoader';
import AdminAside from '@/components/admin/AdminAside';
import AdminHeader from '@/components/admin/AdminHeader';
import GoTop from '@/components/shared/GoTop';

const AdminLayout = () => {
  const { isAuth, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();
  const [sidebarOpenPath, setSidebarOpenPath] = useState(null);
  const isSidebarOpen = sidebarOpenPath === location.pathname;

  // 避免React 路由切換的問題，AOS沒有刷新
  useEffect(() => {
    AOS.refresh();
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpenPath(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 1280px)');
    const handleDesktopChange = (event) => {
      if (event.matches) {
        setSidebarOpenPath(null);
      }
    };

    desktopMedia.addEventListener('change', handleDesktopChange);
    return () => desktopMedia.removeEventListener('change', handleDesktopChange);
  }, []);

  useBodyScrollLock(isSidebarOpen);

  const pageTitle =
    {
      '/admin': 'Dashboard',
      '/admin/products': 'Products',
      '/admin/orders': 'Orders',
      '/admin/coupons': 'Coupons',
      '/admin/articles': 'Articles',
    }[location.pathname] || 'Admin';

  if (!isInitialized) {
    return <PageLoader show zIndex={2000} />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div className="admin">
        <div className="admin-layout">
          <AdminHeader
            title={pageTitle}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() =>
              setSidebarOpenPath((currentPath) =>
                currentPath === location.pathname ? null : location.pathname,
              )
            }
          />
          <div className="admin-wrapper">
            <AdminAside
              id="admin-sidebar"
              isOpen={isSidebarOpen}
              onClose={() => setSidebarOpenPath(null)}
            />
            <button
              type="button"
              className={`admin-sidebar-backdrop ${isSidebarOpen ? 'is-visible' : ''}`}
              aria-label="關閉後台導覽"
              onClick={() => setSidebarOpenPath(null)}
            />
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
