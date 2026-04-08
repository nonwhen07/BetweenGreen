import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  carts: [],
  total: 0,
  final_total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    //撰寫 action：updateCartData（當取得購物車資料時就將資料存回 store）、clearCartData（清空購物車時使用）
    //取得購物車資料後，一併將資料透過 updateCartData 存回 store
    updateCartData(state, action) {
      const { carts, total, final_total } = action.payload;
      state.carts = carts;
      state.total = total;
      state.final_total = final_total;
    },
    clearCartData(state) {
      state.carts = [];
      state.total = 0;
      state.final_total = 0;
    },
  },
});

// 用 actions 將設定好的方法匯出
export const { updateCartData, clearCartData } = cartSlice.actions;

export default cartSlice.reducer;
