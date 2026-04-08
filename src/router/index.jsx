// router.jsx
// ────────────────────────────────────────────────────────────────
// GitHub Pages 部署專用設定說明（2026/03 版）
// ────────────────────────────────────────────────────────────────
// 1. 使用 createHashRouter（帶 # 的 Hash 模式）
//    → 避免 GH Pages 靜態主機 404 問題（最穩、無需伺服器 rewrite）
// 2. 一定要加 basename: '/react_week7_2026'
//    → 讓 <Link>、useNavigate 等自動加上 repo 前綴
//    → 網址會變成：/#/react_week7_2026/products
// 3. vite.config.js 裡的 base 必須是 '/react_week7_2026/'
//    → 打包資源路徑才會正確（js/css/img 前綴）
//    → 注意：vite base 結尾要加 /，router basename 結尾不要加 /
// ────────────────────────────────────────────────────────────────
// 測試方式（本地模擬 GitHub Pages）npm run build
// 用以下指令啟動本地伺服器（模擬 GH Pages 的子目錄）：bash
// npx serve -s dist -l 3000
// 瀏覽器打開：
// http://localhost:3000/react_week7_2026/
// → 應該看到首頁
// 然後點擊產品列表連結，應該跳到：
// http://localhost:3000/react_week7_2026/#/products
// 如果這樣可以正常顯示 + 切換頁面，就代表設定完全正確，可以放心推到 GitHub Pages。

// GH Pages 部署關鍵設定（記住這三點）
// 1. createHashRouter → 防 404
// 2. basename: '/react_week7_2026' → 加 repo 前綴
// 3. vite base: '/react_week7_2026/' → 資源路徑正確

import { createHashRouter } from 'react-router-dom';
import FrontLayout from '@/layouts/FrontLayout';
import AdminLayout from '@/layouts/AdminLayout';

import HomePage from '@/pages/front/HomePage';
import ProductsPage from '@/pages/front/ProductsPage';
import ProductDetailPage from '@/pages/front/ProductDetailPage';
import CartPage from '@/pages/front/CartPage';
import NotFoundPage from '@/pages/front/NotFoundPage';
import LoginPage from '@/pages/admin/LoginPage';

import DashboardPage from '@/pages/admin/DashboardPage';
import AdminProductsPage from '@/pages/admin/ProductsPage';
import AdminNotFoundPage from '@/pages/admin/AdminNotFoundPage';

// 優化寫法：先定義 routes 陣列，再傳給 createHashRouter，結構更清晰也方便上 GitHub Pages自動轉換網址時的維護。
const routes = [
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      { index: true, element: <HomePage /> },
      // { path: 'products', element: <ProductsPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'product/:product_id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'login', element: <LoginPage /> },
      {
        // 404頁面
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        //後台首頁 路由設定，index: true 代表 /admin 就會顯示 DashboardPage
        index: true,
        element: <DashboardPage />,
      },
      { path: 'products', element: <AdminProductsPage /> },
      {
        // Admin 404頁面
        path: '*',
        element: <AdminNotFoundPage />,
      },
    ],
  },
];

const router = createHashRouter(routes, {
  // basename: import.meta.env.PROD ? '/react_week7_2026/' : '/', // GH Pages 必填，與 vite base 一致（不加結尾 /） => 這段有點問題，先暫時註解
  basename: import.meta.env.PROD === 'production' ? '/react_week5_2026/' : '/',
});
export default router;
