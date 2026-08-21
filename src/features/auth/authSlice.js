import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  isInitialized: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authCheckStarted: (state) => {
      state.isInitialized = false;
    },
    loginSuccess: (state, action) => {
      state.isAuth = true;
      state.isInitialized = true;
      state.token = action.payload.token;
      state.user = action.payload.user || null;
    },
    logoutAction: (state) => {
      state.isAuth = false;
      state.isInitialized = true;
      state.token = null;
      state.user = null;
    },
  },
});

export const { authCheckStarted, loginSuccess, logoutAction } =
  authSlice.actions;
export default authSlice.reducer;
