import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import progressReducer from './slices/progressSlice';
import classroomReducer from './slices/classroomSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    progress: progressReducer,
    classroom: classroomReducer
  }
});