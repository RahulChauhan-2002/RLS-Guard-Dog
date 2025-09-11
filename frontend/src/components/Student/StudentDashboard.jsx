import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyClassrooms } from '../../redux/slices/classroomSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { classrooms, loading } = useSelector(state => state.classroom);

  useEffect(() => {
    dispatch(fetchMyClassrooms());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">My Classrooms</h2>
          {classrooms.length === 0 ? (
            <p className="text-gray-600">You are not enrolled in any classrooms yet.</p>
          ) : (
            <ul className="space-y-2">
              {classrooms.map(classroom => (
                <li key={classroom._id} className="border-b pb-2">
                  <div className="font-medium">{classroom.name}</div>
                  <div className="text-sm text-gray-600">
                    Subject: {classroom.subject}
                  </div>
                  <div className="text-sm text-gray-600">
                    Teacher: {classroom.teacherId?.name}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Link
              to="/student/progress"
              className="block p-3 bg-blue-50 rounded hover:bg-blue-100 transition"
            >
              📊 View My Progress
            </Link>
            <div className="p-3 bg-gray-50 rounded">
              📚 Study Materials (Coming Soon)
            </div>
            <div className="p-3 bg-gray-50 rounded">
              📝 Assignments (Coming Soon)
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 card">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-600">No recent activity to display.</p>
      </div>
    </div>
  );
};

export default StudentDashboard;