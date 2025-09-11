import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyClassrooms = createAsyncThunk(
  'classroom/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/classroom/my');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createClassroom = createAsyncThunk(
  'classroom/create',
  async (classroomData, { rejectWithValue }) => {
    try {
      const response = await api.post('/classroom', classroomData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const addStudent = createAsyncThunk(
  'classroom/addStudent',
  async ({ classroomId, studentEmail }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/classroom/${classroomId}/students`, { studentEmail });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const removeStudent = createAsyncThunk(
  'classroom/removeStudent',
  async ({ classroomId, studentId }, { rejectWithValue }) => {
    try {
      await api.delete(`/classroom/${classroomId}/students/${studentId}`);
      return { classroomId, studentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateClassroom = createAsyncThunk(
  'classroom/update',
  async ({ classroomId, updates }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/classroom/${classroomId}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteClassroom = createAsyncThunk(
  'classroom/delete',
  async (classroomId, { rejectWithValue }) => {
    try {
      await api.delete(`/classroom/${classroomId}`);
      return classroomId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const classroomSlice = createSlice({
  name: 'classroom',
  initialState: {
    classrooms: [],
    loading: false,
    error: null
  },
  reducers: {
    clearClassroomError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Classrooms
      .addCase(fetchMyClassrooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyClassrooms.fulfilled, (state, action) => {
        state.loading = false;
        state.classrooms = action.payload;
      })
      .addCase(fetchMyClassrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Classroom
      .addCase(createClassroom.fulfilled, (state, action) => {
        state.classrooms.push(action.payload);
      })
      // Update Classroom
      .addCase(updateClassroom.fulfilled, (state, action) => {
        const index = state.classrooms.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.classrooms[index] = action.payload;
        }
      })
      // Delete Classroom
      .addCase(deleteClassroom.fulfilled, (state, action) => {
        state.classrooms = state.classrooms.filter(c => c._id !== action.payload);
      });
  }
});

export const { clearClassroomError } = classroomSlice.actions;
export default classroomSlice.reducer;