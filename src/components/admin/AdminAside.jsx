import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Activity,
  Box,
  ShoppingBag,
  BookOpen,
  AlertCircle,
  X,
  Home,
} from 'react-feather';

const menu = [
  {
    name: 'Dashboard',
    title: '後台首頁',
    path: '/admin',
    icon: <Activity size={18} />,
    end: true,
  },
  {
    name: 'products',
    title: '產品管理',
    path: '/admin/products',
    icon: <Box size={18} />,
  },
  {
    name: 'Orders',
    title: '訂單列表',
    path: '/admin/orders',
    icon: <ShoppingBag size={18} />,
  },
  {
    name: 'Coupons',
    path: '/admin/coupons',
    title: '優惠卷列表',
    icon: <BookOpen size={18} />,
  },
  {
    name: 'Articles',
    path: '/admin/articles',
    icon: <AlertCircle size={18} />,
    title: '文章管理',
  },

  {
    name: 'BackHome',
    title: '回到前台首頁',
    path: '/',
    icon: <Home size={18} />,
  },
];

const AdminAside = ({ id, isOpen, onClose }) => {
  return (
    <aside id={id} className={`admin-sidebar ${isOpen ? 'is-open' : ''}`}>
      {/* Header */}
      <div className="admin-sidebar__brand">
        <span>植間生活後台</span>
        <button
          type="button"
          className="admin-sidebar__close"
          aria-label="關閉後台導覽"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {/* Menu */}
      <nav className="admin-sidebar__menu">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            title={item.title}
            aria-label={item.title}
            onClick={onClose}
            className={({ isActive }) =>
              `admin-sidebar__item ${isActive ? 'active' : ''}`
            }
          >
            <span className="icon">{item.icon}</span>
            <span className="text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

AdminAside.propTypes = {
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AdminAside;
