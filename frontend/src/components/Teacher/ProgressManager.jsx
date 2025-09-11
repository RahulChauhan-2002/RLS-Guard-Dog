import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  fetchClassroomProgress, 
  createProgress, 
  updateProgress, 
  deleteProgress,
  clearProgressError 
} from '../../redux/slices/progressSlice';
import { fetchMyClassrooms } from '../../redux/slices/classroomSlice';

const ProgressManager = () => {
  const { classroomId } = useParams();
  const dispatch = useDispatch();
  const { classroomProgress, loading, error } = useSelector(state => state.progress);
  const { classrooms } = useSelector(state => state.classroom);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProgress, setEditingProgress] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    score: '',
    totalModules: '',
    completedModules: []
  });

  const currentClassroom = classrooms.find(c => c._id === classroomId);

  useEffect(() => {
    if (classroomId) {
      dispatch(fetchClassroomProgress(classroomId));
    }
    dispatch(fetchMyClassrooms());
    
    return () => {
      dispatch(clearProgressError());
    };
  }, [dispatch, classroomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'score' || name === 'totalModules' ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingProgress) {
      const result = await dispatch(updateProgress({
        progressId: editingProgress._id,
        updates: formData
      }));
      
      if (updateProgress.fulfilled.match(result)) {
        setEditingProgress(null);
        resetForm();
      }
    } else {
      const result = await dispatch(createProgress({
        ...formData,
        classroomId
      }));
      
      if (createProgress.fulfilled.match(result)) {
        setShowCreateForm(false);
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      subject: '',
      score: '',
      totalModules: '',
      completedModules: []
    });
  };

  const handleEdit = (progress) => {
    setEditingProgress(progress);
    setFormData({
      studentId: progress.studentId._id || progress.studentId,
      subject: progress.subject,
      score: progress.score,
      totalModules: progress.totalModules,
      completedModules: progress.completedModules
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (progressId) => {
    if (window.confirm('Are you sure you want to delete this progress entry?')) {
      await dispatch(deleteProgress(progressId));
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingProgress(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Progress Management</h1>
        {currentClassroom && (
          <p className="text-gray-600">
            Classroom: <span className="font-semibold">{currentClassroom.name}</span> - {currentClassroom.subject}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
        >
          {showCreateForm ? 'Cancel' : 'Add Progress Entry'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProgress ? 'Edit Progress Entry' : 'Create New Progress Entry'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="input-field"
                  required
                  placeholder="Enter student ID"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
                  required
                  placeholder="Enter subject"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Score
                </label>
                <input
                  type="number"
                  name="score"
                  value={formData.score}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                  max="100"
                  required
                  placeholder="0-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Total Modules
                </label>
                <input
                  type="number"
                  name="totalModules"
                  value={formData.totalModules}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                  required
                  placeholder="Number of modules"
                />
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button type="submit" className="btn-primary">
                {editingProgress ? 'Update Progress' : 'Create Progress'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classroomProgress.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No progress entries found for this classroom.
          </div>
        ) : (
          classroomProgress.map((progress) => (
            <div key={progress._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {progress.studentId?.name || 'Unknown Student'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {progress.studentId?.email || 'No email'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(progress)}
                    className="btn-secondary text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(progress._id)}
                    className="btn-danger text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Subject:</span> {progress.subject}
                </div>
                <div>
                  <span className="font-semibold">Score:</span> {progress.score}/100
                </div>
                <div>
                  <span className="font-semibold">Progress:</span> {progress.progressPercentage}%
                </div>
                <div>
                  <span className="font-semibold">Modules:</span> {progress.completedModules.length}/{progress.totalModules}
                </div>
                
                {progress.completedModules.length > 0 && (
                  <div>
                    <span className="font-semibold">Completed Modules:</span>
                    <ul className="mt-1 ml-4 text-sm">
                      {progress.completedModules.map((module, index) => (
                        <li key={index} className="list-disc">
                          {module.moduleName} - Score: {module.score}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  Last Updated: {new Date(progress.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProgressManager;
