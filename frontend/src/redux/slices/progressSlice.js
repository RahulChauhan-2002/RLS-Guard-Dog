import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyProgress = createAsyncThunk(
  'progress/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/progress/my');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchClassroomProgress = createAsyncThunk(
  'progress/fetchClassroom',
  async (classroomId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/progress/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createProgress = createAsyncThunk(
  'progress/create',
  async (progressData, { rejectWithValue }) => {
    try {
      const response = await api.post('/progress', progressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateProgress = createAsyncThunk(
  'progress/update',
  async ({ progressId, updates }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/progress/${progressId}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteProgress = createAsyncThunk(
  'progress/delete',
  async (progressId, { rejectWithValue }) => {
    try {
      await api.delete(`/progress/${progressId}`);
      return progressId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    myProgress: [],
    classroomProgress: [],
    loading: false,
    error: null
  },
  reducers: {
    clearProgressError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Progress
      .addCase(fetchMyProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.myProgress = action.payload;
      })
      .addCase(fetchMyProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Classroom Progress
      .addCase(fetchClassroomProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClassroomProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.classroomProgress = action.payload;
      })
      .addCase(fetchClassroomProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Progress
      .addCase(createProgress.fulfilled, (state, action) => {
        state.classroomProgress.push(action.payload);
      })
      // Update Progress
      .addCase(updateProgress.fulfilled, (state, action) => {
        const index = state.classroomProgress.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.classroomProgress[index] = action.payload;
        }
      })
      // Delete Progress
      .addCase(deleteProgress.fulfilled, (state, action) => {
        state.classroomProgress = state.classroomProgress.filter(p => p._id !== action.payload);
      });
  }
});

export const { clearProgressError } = progressSlice.actions;
export default progressSlice.reducer;