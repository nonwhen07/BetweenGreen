import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';
import { logout } from '@/services/authService';
import { useToast } from '@/hooks/useToast';
import { logoutAction } from '@/features/auth/authSlice';
import { handleApiError } from '@/utils/apiErrorHandler';

const routes = [
  { path: '/', name: '首頁' },
  { path: '/products', name: '產品列表' },
  { path: '/cart', name: '購物車' },
  //   { path: '/about', name: 'About' },
  //   { path: '/favorite', name: 'Favorite' },
  //   { path: '/orders', name: 'Orders' },
];

const FrontHeader = () => {
  // 初始化
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, showError } = useToast();

  // useCartInit(); // UI就專心處理UI，讓父層 FrontLayout 處理商業邏輯

  const isLogin = useSelector((state) => state.auth.isLogin);
  const carts = useSelector((state) => state.cart.carts);

  //加入登出
  const handleLogout = async () => {
    try {
      await logout(); // 呼叫 API
    } catch (err) {
      const errorMessage = handleApiError(err, null, '登出失敗，請稍後再試。');
      showError(errorMessage);
    }

    dispatch(logoutAction()); // 清 Redux
    success('已成功登出，將跳轉到前台首頁。');
    navigate('/');
  };

  return (
    <>
      <nav className="navbar header border-bottom border-body">
        <div className="container">
          <ul className="navbar-nav flex-row gap-5 fs-5">
            {routes.map((route) => (
              <li key={route.path} className="nav-item">
                <NavLink className="nav-link text-light" aria-current="page" to={route.path}>
                  {route.path === 'cart' ? (
                    <div className="position-relative">
                      <FaShoppingCart size={20} />
                      {carts?.length > 0 && (
                        <span
                          className="position-absolute badge rounded-circle text-bg-danger"
                          style={{ bottom: '12px', left: '12px' }}
                        >
                          {carts.length}
                        </span>
                      )}
                    </div>
                  ) : (
                    route.name
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          {/* 登入 / 登出區塊 */}
          {isLogin ? (
            <>
              <NavLink to="/dashboard" className="nav-item nav-link me-4">
                後台
              </NavLink>
              <button onClick={handleLogout} className="btn btn-link nav-item nav-link text-danger">
                登出
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-item nav-link text-light me-4">
              登入
            </NavLink>
          )}
        </div>
      </nav>
    </>
  );
};

export default FrontHeader;
