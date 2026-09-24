import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAllProducts } from '@/services/productService';
import { extractErrorMessage } from '@/utils/errorHandler';

const initialState = {
  products: [],
  status: 'idle',
  error: null,
  lastFetchedAt: null,
  activeRequestId: null,
};

const FRONT_PRODUCT_CACHE_TTL = 5 * 60 * 1000;

const normalizeProducts = (source) => {
  if (Array.isArray(source)) return source;

  return Object.entries(source || {}).map(([id, product]) => ({
    ...product,
    id: product?.id || id,
  }));
};

export const fetchFrontProducts = createAsyncThunk(
  'frontProduct/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllProducts();

      return normalizeProducts(response.data);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, null, '取得商品列表失敗，請稍後再試。'),
      );
    }
  },
);

export const ensureFrontProducts = () => (dispatch, getState) => {
  const { products, status, lastFetchedAt } = getState().frontProduct;
  const isFresh = lastFetchedAt && Date.now() - lastFetchedAt < FRONT_PRODUCT_CACHE_TTL;

  if ((status === 'success' && isFresh) || status === 'loading') {
    return Promise.resolve(products);
  }

  return dispatch(fetchFrontProducts());
};

const frontProductSlice = createSlice({
  name: 'frontProduct',
  initialState,
  reducers: {
    clearFrontProducts: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFrontProducts.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.activeRequestId = action.meta.requestId;
      })
      .addCase(fetchFrontProducts.fulfilled, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return;

        state.products = action.payload;
        state.status = 'success';
        state.error = null;
        state.lastFetchedAt = Date.now();
        state.activeRequestId = null;
      })
      .addCase(fetchFrontProducts.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return;

        state.status = 'error';
        state.error = action.payload || action.error.message;
        state.activeRequestId = null;
      });
  },
});

export const { clearFrontProducts } = frontProductSlice.actions;

export const selectFrontProducts = (state) => state.frontProduct.products;
export const selectFrontProductsStatus = (state) => state.frontProduct.status;
export const selectFrontProductsError = (state) => state.frontProduct.error;
export const selectFrontProductsLastFetchedAt = (state) => state.frontProduct.lastFetchedAt;

export default frontProductSlice.reducer;
