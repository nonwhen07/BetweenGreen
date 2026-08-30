import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// services
import { getAllAdminProducts } from '@/services/productService';
// features
import { logoutAction } from '@/features/auth/authSlice';
import { startLoading, stopLoading } from '@/features/ui/loadingSlice';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

const initialState = {
  products: [],
  status: 'idle',
  error: null,
  lastFetchedAt: null,
};

const normalizeProducts = (source) => {
  if (Array.isArray(source)) return source;

  return Object.entries(source || {}).map(([id, product]) => ({
    ...product,
    id: product?.id || id,
  }));
};

export const fetchAdminProducts = createAsyncThunk(
  'product/fetchAdminProducts',
  async ({ background = false } = {}, { dispatch, rejectWithValue }) => {
    if (!background) dispatch(startLoading());

    try {
      const response = await getAllAdminProducts();

      return normalizeProducts(response.data);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, null, '取得產品列表失敗，請稍後再試。'),
      );
    } finally {
      if (!background) dispatch(stopLoading());
    }
  },
);

// Dashboard 與 ProductsPage 第一次進入時共用；已有成功快取就不重抓。
export const ensureAdminProducts = () => (dispatch, getState) => {
  const { products, status } = getState().product;

  if (status === 'success' || status === 'loading') {
    return Promise.resolve(products);
  }

  return dispatch(fetchAdminProducts()).unwrap();
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearAdminProducts: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = 'success';
        state.error = null;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload || action.error.message;
      })
      // 避免不同管理員在同一個瀏覽器工作階段共用舊商品快取。
      .addCase(logoutAction, () => ({ ...initialState }));
  },
});

export const { clearAdminProducts } = productSlice.actions;

export const selectAdminProducts = (state) => state.product.products;
export const selectAdminProductsStatus = (state) => state.product.status;
export const selectAdminProductsError = (state) => state.product.error;
export const selectAdminProductsLastFetchedAt = (state) =>
  state.product.lastFetchedAt;

export default productSlice.reducer;
