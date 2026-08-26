import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// services
import { getAllAdminCoupons } from '@/services/couponService';
// features
import { logoutAction } from '@/features/auth/authSlice';
import { startLoading, stopLoading } from '@/features/ui/loadingSlice';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

const initialState = {
  coupons: [],
  status: 'idle',
  error: null,
  lastFetchedAt: null,
};

const normalizeCouponList = (source) => {
  if (Array.isArray(source)) return source;

  return Object.entries(source || {}).map(([id, coupon]) => ({
    ...coupon,
    id: coupon?.id || id,
  }));
};

export const fetchAdminCoupons = createAsyncThunk(
  'coupon/fetchAdminCoupons',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());

    try {
      const response = await getAllAdminCoupons();

      return normalizeCouponList(response.data);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, null, '取得優惠券列表失敗，請稍後再試。'),
      );
    } finally {
      dispatch(stopLoading());
    }
  },
);

// Dashboard 與 CouponsPage 共用第一次成功載入的 Store 快取。
export const ensureAdminCoupons = () => (dispatch, getState) => {
  const { coupons, status } = getState().coupon;

  if (status === 'success' || status === 'loading') {
    return Promise.resolve(coupons);
  }

  return dispatch(fetchAdminCoupons()).unwrap();
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    upsertAdminCoupon: (state, action) => {
      const coupon = action.payload;
      const couponIndex = state.coupons.findIndex(
        (item) => item.id === coupon.id,
      );

      if (couponIndex >= 0) {
        state.coupons[couponIndex] = {
          ...state.coupons[couponIndex],
          ...coupon,
        };
      } else {
        state.coupons.unshift(coupon);
      }

      state.status = 'success';
      state.error = null;
    },
    removeAdminCoupon: (state, action) => {
      state.coupons = state.coupons.filter(
        (coupon) => coupon.id !== action.payload,
      );
      state.status = 'success';
      state.error = null;
    },
    clearAdminCoupons: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCoupons.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminCoupons.fulfilled, (state, action) => {
        state.coupons = action.payload;
        state.status = 'success';
        state.error = null;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchAdminCoupons.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload || action.error.message;
      })
      .addCase(logoutAction, () => ({ ...initialState }));
  },
});

export const {
  clearAdminCoupons,
  removeAdminCoupon,
  upsertAdminCoupon,
} = couponSlice.actions;

export const selectAdminCoupons = (state) => state.coupon.coupons;
export const selectAdminCouponsStatus = (state) => state.coupon.status;
export const selectAdminCouponsError = (state) => state.coupon.error;
export const selectAdminCouponsLastFetchedAt = (state) =>
  state.coupon.lastFetchedAt;

export default couponSlice.reducer;
