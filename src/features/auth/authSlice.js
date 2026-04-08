import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuth = true;
      state.token = action.payload.token;
      state.user = action.payload.user || null;
    },
    logoutAction: (state) => {
      state.isAuth = false;
      state.token = null;
      state.user = null;
    },
  },
});

export const { loginSuccess, logoutAction } = authSlice.actions;
export default authSlice.reducer;
