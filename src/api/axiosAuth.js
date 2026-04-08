import axios from 'axios';
import { getToken } from '@/utils/auth';

const API_URL = import.meta.env.VITE_API_URL;

const axiosAuth = axios.create({
  baseURL: `${API_URL}/v2`,
  timeout: 10000,
});

// ⭐自動帶 token
axiosAuth.interceptors.request.use((config) => {
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

export default axiosAuth;
