// axios instance (全站共用 API 基礎設定)
// React 電商最常見資料流：Page面 -> Service -> Axios -> API Server
// 這樣的好處是：
// 1. Page面只專注在畫面邏輯，Service專注在資料邏輯，Axios專注在API設定，分工清楚
// 2. 如果API URL改變，只需要修改axios.js，不用每個Page都改
// 3. Service可以做額外的資料處理，例如格式化、錯誤處理等，讓Page拿到乾淨的資料
// 網站其實只有三種 API：

// 1️⃣ 不需要登入
// 2️⃣ 使用者登入
// 3️⃣ 管理員登入
// 對應就是：

// axiosPublic
// axiosUser
// axiosAdmin

// 這邊設計偏向axiosPublic

import axios from 'axios';
import { getToken } from '@/utils/auth';

const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export const BASE_URL = `${API_URL}/v2/api/${API_PATH}`;

const axiosAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// ⭐一樣帶 token
axiosAPI.interceptors.request.use((config) => {
  // const token = document.cookie.replace(
  //   /(?:(?:^|.*;\s*)hexToken_week7\s*=\s*([^;]*).*$)|^.*$/,
  //   '$1',
  // );

  const token = getToken();
  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

// 未來只需要 axiosAPI.get('/products')
// 不用每頁都寫 axios.get(`${BASE_URL}/products`)，減少重複程式碼

export default axiosAPI;
