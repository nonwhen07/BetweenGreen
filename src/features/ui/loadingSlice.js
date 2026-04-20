import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    count: 0, //  用 count 解決多請求問題
  },
  reducers: {
    startLoading: (state) => {
      state.count += 1;
    },
    stopLoading: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
    resetLoading: (state) => {
      state.count = 0;
    },
  },
});

export const { startLoading, stopLoading, resetLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
