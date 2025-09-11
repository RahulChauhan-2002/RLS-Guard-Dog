import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/slices/authSlice';

// Components
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/Layout/PrivateRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Student/StudentDashboard';
import StudentProgress from './components/Student/StudentProgress';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import ClassroomManager from './components/Teacher/ClassroomManager';
import ProgressManager from './components/Teacher/ProgressManager';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <Login />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/" /> : <Register />
            } />

            {/* Protected Routes */}
            <Route path="/" element={
              <PrivateRoute>
                {user?.role === 'teacher' ? (
                  <Navigate to="/teacher/dashboard" />
                ) : (
                  <Navigate to="/student/dashboard" />
                )}
              </PrivateRoute>
            } />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <PrivateRoute requiredRole="student">
                <StudentDashboard />
              </PrivateRoute>
            } />
            <Route path="/student/progress" element={
              <PrivateRoute requiredRole="student">
                <StudentProgress />
              </PrivateRoute>
            } />

            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={
              <PrivateRoute requiredRole="teacher">
                <TeacherDashboard />
              </PrivateRoute>
            } />
            <Route path="/teacher/classrooms" element={
              <PrivateRoute requiredRole="teacher">
                <ClassroomManager />
              </PrivateRoute>
            } />
            <Route path="/teacher/progress/:classroomId" element={
              <PrivateRoute requiredRole="teacher">
                <ProgressManager />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;