import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// services
import { getAllAdminArticles } from '@/services/articleService';
// features
import { logoutAction } from '@/features/auth/authSlice';
import { startLoading, stopLoading } from '@/features/ui/loadingSlice';
// utils
import { extractErrorMessage } from '@/utils/errorHandler';

const initialState = {
  articles: [],
  status: 'idle',
  error: null,
  lastFetchedAt: null,
};

const normalizeArticleList = (source) => {
  if (Array.isArray(source)) return source;
  return Object.entries(source || {}).map(([id, article]) => ({
    ...article,
    id: article?.id || id,
  }));
};

export const fetchAdminArticles = createAsyncThunk(
  'article/fetchAdminArticles',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());

    try {
      const response = await getAllAdminArticles();
      return normalizeArticleList(response.data);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, null, '取得文章列表失敗，請稍後再試。'),
      );
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const ensureAdminArticles = () => (dispatch, getState) => {
  const { articles, status } = getState().article;
  if (status === 'success' || status === 'loading') {
    return Promise.resolve(articles);
  }
  return dispatch(fetchAdminArticles()).unwrap();
};

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    upsertAdminArticle: (state, action) => {
      const article = action.payload;
      const index = state.articles.findIndex((item) => item.id === article.id);
      if (index >= 0) {
        state.articles[index] = { ...state.articles[index], ...article };
      } else {
        state.articles.unshift(article);
      }
      state.status = 'success';
      state.error = null;
    },
    removeAdminArticle: (state, action) => {
      state.articles = state.articles.filter(
        (article) => article.id !== action.payload,
      );
      state.status = 'success';
      state.error = null;
    },
    clearAdminArticles: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminArticles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminArticles.fulfilled, (state, action) => {
        state.articles = action.payload;
        state.status = 'success';
        state.error = null;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchAdminArticles.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload || action.error.message;
      })
      .addCase(logoutAction, () => ({ ...initialState }));
  },
});

export const {
  clearAdminArticles,
  removeAdminArticle,
  upsertAdminArticle,
} = articleSlice.actions;

export const selectAdminArticles = (state) => state.article.articles;
export const selectAdminArticlesStatus = (state) => state.article.status;
export const selectAdminArticlesError = (state) => state.article.error;
export const selectAdminArticlesLastFetchedAt = (state) =>
  state.article.lastFetchedAt;

export default articleSlice.reducer;
