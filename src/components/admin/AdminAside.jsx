import { useState } from 'react';
import { NavLink } from 'react-router-dom';
// import {
//   FaTachometerAlt,
//   FaBoxOpen,
//   // FaShoppingCart,
//   // FaTicketAlt,
//   // FaNewspaper,
//   FaHome,
//   FaAlignJustify,
// } from 'react-icons/fa';

import {
  Activity,
  Box,
  Users,
  ShoppingBag,
  BookOpen,
  AlertCircle,
  ThumbsUp,
  Menu,
  Home,
  Calendar,
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
  // {
  //   path: '/admin/orders',
  //   name: 'Orders',
  //   icon: FaShoppingCart,
  //   title: '訂單列表',
  // },
  // {
  //   path: '/admin/coupons',
  //   name: 'Coupons',
  //   icon: FaTicketAlt,
  //   title: '優惠卷列表',
  // },
  // {
  //   path: '/admin/news',
  //   name: 'News',
  //   icon: <AlertCircle size={18} />,
  //   title: '最新消息',
  // },

  {
    name: 'BackHome',
    title: '回到前台首頁',
    path: '/',
    icon: <Home size={18} />,
  },
];

const AdminAside = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Header */}
        <div className="admin-sidebar__brand">
          <span>植間生活後台</span>
          <button onClick={() => setCollapsed(!collapsed)}>
            <Menu size={18} />
          </button>
        </div>
        {/* Menu */}
        <nav className="admin-sidebar__menu">
          {/* {menu.map((menuItem) => {
          const Icon = menuItem.icon;
          return (
            <NavLink
              key={menuItem.path}
              to={menuItem.path}
              end={menuItem.end}
              title={menuItem.title}
              aria-label={menuItem.title}
              className={({ isActive }) => `nav-link ${isActive ? 'active text-warning' : ''}`}
            >
              <Icon className="me-2" size={18} />
              {menuItem.name}
            </NavLink>
          );
        })} */}
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `admin-sidebar__item ${isActive ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="text">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminAside;
