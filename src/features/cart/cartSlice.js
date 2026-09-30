import { createSlice } from '@reduxjs/toolkit';
import { EMPTY_CART_DATA, normalizeCartData } from '@/utils/cartUtils';

const initialState = { ...EMPTY_CART_DATA };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    //撰寫 action：updateCartData（當取得購物車資料時就將資料存回 store）、clearCartData（清空購物車時使用）
    //取得購物車資料後，一併將資料透過 updateCartData 存回 store
    updateCartData(state, action) {
      const { carts, total, final_total } = normalizeCartData(action.payload);

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

export const selectCartData = (state) => state.cart;
export const selectCartItems = (state) => state.cart.carts;

export default cartSlice.reducer;
