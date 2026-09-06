import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/services/authService';
import { clearToken } from '@/utils/auth';
import { logoutAction } from '@/features/auth/authSlice';
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FaAlignJustify, FaUser, FaSignOutAlt } from 'react-icons/fa';
// import { toast } from '@/utils/toast';

import { useToast } from '@/hooks/useToast';

const AdminHeader = ({ title, isSidebarOpen, onToggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 初始化 dispatch
  const dispatch = useDispatch();
  // 初始化 navigate
  const navigate = useNavigate();

  const isAuth = useSelector((state) => state.auth.isAuth);
  const { success, showError } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      clearToken();
      dispatch(logoutAction());
      success('登出成功，即將跳轉到登入面。');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      showError('登出失敗，請重新嘗試。');
    }
  };
  //  點外部關閉 dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="admin-header">
      {/* {isAuth ? <span>Admin已登入</span> : <span>未登入</span>}
      <span className="navbar-brand mb-0 h5">Admin Dashboard</span>
      <button onClick={handleLogout} type="button" className="btn btn-secondary">
        登出
      </button> */}

      {/* 左側 */}
      <div className="admin-header__left">
        <button
          type="button"
          className="admin-header__toggle"
          aria-label={isSidebarOpen ? '關閉後台導覽' : '開啟後台導覽'}
          aria-controls="admin-sidebar"
          aria-expanded={isSidebarOpen}
          onClick={onToggleSidebar}
        >
          <FaAlignJustify size={18} />
        </button>

        {/* Breadcrumb / Title */}
        <div className="admin-header__title">{title}</div>
      </div>
      {/* 右側 */}
      <div className="admin-header__right" ref={dropdownRef}>
        <button
          type="button"
          className="admin-header__user"
          aria-haspopup="menu"
          aria-controls="admin-account-menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <FaUser size={18} />
          <span>{'Admin'}</span>
        </button>

        {open && (
          <div id="admin-account-menu" className="admin-header__dropdown">
            {/* 可以加更多額外資訊 */}
            <div className="dropdown-item">
              👤 {isAuth ? <span>Admin已登入</span> : <span>未登入</span>}
            </div>
            <div className="dropdown-divider" />
            <button type="button" className="dropdown-item logout" onClick={handleLogout}>
              <FaSignOutAlt size={18} />
              登出
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

AdminHeader.propTypes = {
  title: PropTypes.string.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
};

export default AdminHeader;
