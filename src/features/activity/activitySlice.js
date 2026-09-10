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
  activeFetchRequestId: null,
  fetchMutationRevision: null,
  mutationRevision: 0,
  pendingRecordRequestIds: [],
  reviewRequestIdByActivityId: {},
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
      .addCase(fetchAdminActivities.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.activeFetchRequestId = action.meta.requestId;
        state.fetchMutationRevision = state.mutationRevision;
      })
      .addCase(fetchAdminActivities.fulfilled, (state, action) => {
        if (state.activeFetchRequestId !== action.meta.requestId) return;

        const canApplyResponse =
          state.fetchMutationRevision === state.mutationRevision;
        state.activeFetchRequestId = null;
        state.fetchMutationRevision = null;

        // Fetch 途中若已有新增／確認操作完成，保留較新的本機結果。
        if (!canApplyResponse) return;

        state.activities = action.payload;
        state.status = 'success';
        state.error = null;
      })
      .addCase(fetchAdminActivities.rejected, (state, action) => {
        if (state.activeFetchRequestId !== action.meta.requestId) return;

        const canApplyResponse =
          state.fetchMutationRevision === state.mutationRevision;
        state.activeFetchRequestId = null;
        state.fetchMutationRevision = null;

        if (!canApplyResponse) return;

        state.status = 'error';
        state.error = action.payload || action.error.message;
      })
      .addCase(recordAdminActivity.pending, (state, action) => {
        state.pendingRecordRequestIds.push(action.meta.requestId);
      })
      .addCase(recordAdminActivity.fulfilled, (state, action) => {
        const requestIndex = state.pendingRecordRequestIds.indexOf(
          action.meta.requestId,
        );
        if (requestIndex < 0) return;

        state.pendingRecordRequestIds.splice(requestIndex, 1);
        state.activities.unshift(action.payload);
        state.status = 'success';
        state.error = null;
        state.mutationRevision += 1;
      })
      .addCase(recordAdminActivity.rejected, (state, action) => {
        const requestIndex = state.pendingRecordRequestIds.indexOf(
          action.meta.requestId,
        );
        if (requestIndex < 0) return;

        state.pendingRecordRequestIds.splice(requestIndex, 1);
        state.error = action.payload || action.error.message;
      })
      .addCase(setAdminActivityReviewed.pending, (state, action) => {
        state.reviewRequestIdByActivityId[action.meta.arg.activityId] =
          action.meta.requestId;
      })
      .addCase(setAdminActivityReviewed.fulfilled, (state, action) => {
        const activityId = action.meta.arg.activityId;
        if (
          state.reviewRequestIdByActivityId[activityId] !==
          action.meta.requestId
        ) {
          return;
        }

        delete state.reviewRequestIdByActivityId[activityId];
        const activityIndex = state.activities.findIndex(
          (activity) => activity.id === action.payload.id,
        );

        if (activityIndex >= 0) {
          state.activities[activityIndex] = action.payload;
        }

        state.status = 'success';
        state.error = null;
        state.mutationRevision += 1;
      })
      .addCase(setAdminActivityReviewed.rejected, (state, action) => {
        const activityId = action.meta.arg.activityId;
        if (
          state.reviewRequestIdByActivityId[activityId] !==
          action.meta.requestId
        ) {
          return;
        }

        delete state.reviewRequestIdByActivityId[activityId];
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
