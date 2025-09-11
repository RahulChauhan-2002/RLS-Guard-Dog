import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProgress } from '../../redux/slices/progressSlice';

const StudentProgress = () => {
  const dispatch = useDispatch();
  const { myProgress, loading } = useSelector(state => state.progress);

  useEffect(() => {
    dispatch(fetchMyProgress());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Progress</h1>

      {myProgress.length === 0 ? (
        <div className="card">
          <p className="text-gray-600">No progress records found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProgress.map(progress => (
            <div key={progress._id} className="card">
              <h3 className="text-lg font-semibold mb-2">
                {progress.classroomId?.name || 'Unknown Classroom'}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">{progress.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Score:</span>
                  <span className="font-medium">{progress.score}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">
                    {progress.progressPercentage?.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress.progressPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>
                {progress.completedModules && progress.completedModules.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600 mb-1">Completed Modules:</p>
                    <ul className="text-sm space-y-1">
                      {progress.completedModules.map((module, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{module.moduleName}</span>
                          <span className="text-gray-500">{module.score}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-3">
                  Last updated: {new Date(progress.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProgress;