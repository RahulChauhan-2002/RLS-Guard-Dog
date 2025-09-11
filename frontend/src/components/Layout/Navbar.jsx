import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            🛡️ RLS Guard Dog
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'teacher' ? (
                  <>
                    <Link to="/teacher/dashboard" className="hover:text-blue-200">
                      Dashboard
                    </Link>
                    <Link to="/teacher/classrooms" className="hover:text-blue-200">
                      Classrooms
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/student/dashboard" className="hover:text-blue-200">
                      Dashboard
                    </Link>
                    <Link to="/student/progress" className="hover:text-blue-200">
                      My Progress
                    </Link>
                  </>
                )}
                <span className="text-blue-200">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;