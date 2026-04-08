// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
import React from 'react';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/main.scss'; // 入口 Sass
import '@/styles/admin.scss'; // 後台入口 Sass

import App from '@/App.jsx';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Toast from '@/components/ToastList.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Toast /> {/* 確保 Toast 能全局監聽 Redux 狀態 */}
    <App />
  </Provider>,
);
