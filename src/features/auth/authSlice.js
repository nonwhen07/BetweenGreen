import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  isInitialized: false,
  token: null,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authCheckStarted: (state) => {
      state.isInitialized = false;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuth = true;
      state.isInitialized = true;
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.error = null;
    },
    authCheckUnavailable: (state, action) => {
      // 暫時無法向伺服器驗證時，不把尚未證實失效的 Cookie 清掉。
      // Redux 仍維持未登入，避免在無法確認權限時放行後台頁面。
      state.isAuth = false;
      state.isInitialized = true;
      state.token = null;
      state.user = null;
      state.error = action.payload;
    },
    logoutAction: (state) => {
      state.isAuth = false;
      state.isInitialized = true;
      state.token = null;
      state.user = null;
      state.error = null;
    },
  },
});

export const {
  authCheckStarted,
  authCheckUnavailable,
  loginSuccess,
  logoutAction,
} = authSlice.actions;
export default authSlice.reducer;
