import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// features
import { logoutAction } from '@/features/auth/authSlice';
// services
import {
  createAdminActivity,
  getAdminActivities,
  updateAdminActivityReviewed,
} from '@/services/adminActivityService';

const initialState = {
  activities: [],
  status: 'idle',
  error: null,
};

export const fetchAdminActivities = createAsyncThunk(
  'activity/fetchAdminActivities',
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminActivities();
    } catch (error) {
      return rejectWithValue(error.message || '取得操作紀錄失敗');
    }
  },
);

export const recordAdminActivity = createAsyncThunk(
  'activity/recordAdminActivity',
  async (activityData, { rejectWithValue }) => {
    try {
      return await createAdminActivity(activityData);
    } catch (error) {
      return rejectWithValue(error.message || '保存操作紀錄失敗');
    }
  },
);

export const setAdminActivityReviewed = createAsyncThunk(
  'activity/setAdminActivityReviewed',
  async ({ activityId, isReviewed }, { rejectWithValue }) => {
    try {
      return await updateAdminActivityReviewed(activityId, isReviewed);
    } catch (error) {
      return rejectWithValue(error.message || '更新操作紀錄失敗');
    }
  },
);

export const ensureAdminActivities = () => (dispatch, getState) => {
  const { activities, status } = getState().activity;

  if (status === 'success' || status === 'loading') {
    return Promise.resolve(activities);
  }

  return dispatch(fetchAdminActivities()).unwrap();
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminActivities.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
        state.status = 'success';
        state.error = null;
      })
      .addCase(fetchAdminActivities.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload || action.error.message;
      })
      .addCase(recordAdminActivity.fulfilled, (state, action) => {
        state.activities.unshift(action.payload);
        state.status = 'success';
        state.error = null;
      })
      .addCase(recordAdminActivity.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(setAdminActivityReviewed.fulfilled, (state, action) => {
        const activityIndex = state.activities.findIndex(
          (activity) => activity.id === action.payload.id,
        );

        if (activityIndex >= 0) {
          state.activities[activityIndex] = action.payload;
        }
      })
      .addCase(setAdminActivityReviewed.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      // 清除記憶體資料，但保留 localStorage 紀錄給下一次登入載入。
      .addCase(logoutAction, () => ({ ...initialState }));
  },
});

export const selectAdminActivities = (state) => state.activity.activities;
export const selectAdminActivitiesStatus = (state) => state.activity.status;
export const selectAdminActivitiesError = (state) => state.activity.error;

export default activitySlice.reducer;
