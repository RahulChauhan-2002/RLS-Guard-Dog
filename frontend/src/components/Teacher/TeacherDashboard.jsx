import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyClassrooms } from '../../redux/slices/classroomSlice';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { classrooms, loading } = useSelector(state => state.classroom);

  useEffect(() => {
    dispatch(fetchMyClassrooms());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const totalStudents = classrooms.reduce((acc, classroom) => 
    acc + (classroom.students?.length || 0), 0
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome back, {user?.name}!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-800">Total Classrooms</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{classrooms.length}</p>
        </div>
        <div className="card bg-green-50">
          <h3 className="text-lg font-semibold text-green-800">Total Students</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{totalStudents}</p>
        </div>
        <div className="card bg-purple-50">
          <h3 className="text-lg font-semibold text-purple-800">Active Classes</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {classrooms.filter(c => c.isActive).length}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Classrooms</h2>
          <Link to="/teacher/classrooms" className="btn-primary">
            Manage Classrooms
          </Link>
        </div>

        {classrooms.length === 0 ? (
          <p className="text-gray-600">No classrooms created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-center">Students</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classrooms.map(classroom => (
                  <tr key={classroom._id} className="border-b">
                    <td className="px-4 py-2">{classroom.name}</td>
                    <td className="px-4 py-2">{classroom.subject}</td>
                    <td className="px-4 py-2 text-center">
                      {classroom.students?.length || 0}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        classroom.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {classroom.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Link
                        to={`/teacher/progress/${classroom._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Progress
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;