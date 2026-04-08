import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBoxOpen,
  // FaShoppingCart,
  // FaTicketAlt,
  // FaNewspaper,
  FaHome,
  FaAlignJustify,
} from 'react-icons/fa';

const menu = [
  {
    path: '/admin',
    name: 'Dashboard',
    icon: FaTachometerAlt,
    title: '後台首頁',
    end: true,
  },
  {
    path: '/admin/products',
    name: 'products',
    icon: FaBoxOpen,
    title: '產品列表',
  },
  // {
  //   path: '/admin/orders',
  //   name: 'Orders',
  //   icon: FaShoppingCart,
  //   title: '優惠卷列表',
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
  //   icon: FaNewspaper,
  //   title: '最新消息',
  // },
  { path: '/', name: 'BackHome', icon: FaHome, title: '回到前台首頁' },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="admin-sidebar__brand">
        <span>My Admin</span>
        <button onClick={() => setCollapsed(!collapsed)}>
          <FaAlignJustify size={18} />
        </button>
      </div>
      {/* Menu */}
      <nav className="admin-sidebar__menu">
        {/* end={route.path === '/admin'} ， React Router： end = exact match 
          意思變成： /admin ✔ /admin/productlist ✖ ，所以： 後台首頁 active 產品列表 inactive */}
        {menu.map((menuItem) => {
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
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
