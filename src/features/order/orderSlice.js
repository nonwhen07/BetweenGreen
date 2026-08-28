import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// services
import { getAllAdminOrders } from '@/services/orderService';
// features
import { logoutAction } from '@/features/auth/authSlice';
import { startLoading, stopLoading } from '@/features/ui/loadingSlice';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';
import { normalizeOrderList } from '@/utils/orderFormatter';

const initialState = {
  orders: [],
  status: 'idle',
  error: null,
  lastFetchedAt: null,
};

export const fetchAdminOrders = createAsyncThunk(
  'order/fetchAdminOrders',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());

    try {
      const response = await getAllAdminOrders();
      return normalizeOrderList(response.data);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, null, '取得訂單列表失敗，請稍後再試。'),
      );
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const ensureAdminOrders = () => (dispatch, getState) => {
  const { orders, status } = getState().order;

  if (status === 'success' || status === 'loading') {
    return Promise.resolve(orders);
  }

  return dispatch(fetchAdminOrders()).unwrap();
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    updateAdminOrderPayment: (state, action) => {
      const { orderId, isPaid } = action.payload;
      const order = state.orders.find((item) => item.id === orderId);

      if (order) order.is_paid = Boolean(isPaid);
      state.status = 'success';
      state.error = null;
    },
    removeAdminOrder: (state, action) => {
      state.orders = state.orders.filter((order) => order.id !== action.payload);
      state.status = 'success';
      state.error = null;
    },
    clearAdminOrders: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.status = 'success';
        state.error = null;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload || action.error.message;
      })
      .addCase(logoutAction, () => ({ ...initialState }));
  },
});

export const {
  clearAdminOrders,
  removeAdminOrder,
  updateAdminOrderPayment,
} = orderSlice.actions;

export const selectAdminOrders = (state) => state.order.orders;
export const selectAdminOrdersStatus = (state) => state.order.status;
export const selectAdminOrdersError = (state) => state.order.error;
export const selectAdminOrdersLastFetchedAt = (state) =>
  state.order.lastFetchedAt;

export default orderSlice.reducer;

