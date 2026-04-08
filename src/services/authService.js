import axiosAuth from '@/api/axiosAuth';

// 登入
export const login = async (account) => {
  const res = await axiosAuth.post('/admin/signin', account);
  return res.data;
};

// 檢查登入
export const checkAuth = async () => {
  const res = await axiosAuth.post('/api/user/check');
  return res.data;
};

// 登出
export const logout = async () => {
  const res = await axiosAuth.post('/logout');
  return res.data;
};
