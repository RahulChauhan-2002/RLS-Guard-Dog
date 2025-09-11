import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMyClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  addStudent,
  removeStudent
} from '../../redux/slices/classroomSlice';

const ClassroomManager = () => {
  const dispatch = useDispatch();
  const { classrooms, loading } = useSelector(state => state.classroom);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: ''
  });
  const [studentEmail, setStudentEmail] = useState('');
  const [addingStudentTo, setAddingStudentTo] = useState(null);

  useEffect(() => {
    dispatch(fetchMyClassrooms());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingClassroom) {
      await dispatch(updateClassroom({
        classroomId: editingClassroom._id,
        updates: formData
      }));
      setEditingClassroom(null);
    } else {
      await dispatch(createClassroom(formData));
    }
    
    setFormData({ name: '', subject: '', description: '' });
    setShowCreateForm(false);
  };

  const handleEdit = (classroom) => {
    setEditingClassroom(classroom);
    setFormData({
      name: classroom.name,
      subject: classroom.subject,
      description: classroom.description || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (classroomId) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      await dispatch(deleteClassroom(classroomId));
    }
  };

  const handleAddStudent = async (e, classroomId) => {
    e.preventDefault();
    await dispatch(addStudent({ classroomId, studentEmail }));
    setStudentEmail('');
    setAddingStudentTo(null);
    dispatch(fetchMyClassrooms());
  };

  const handleRemoveStudent = async (classroomId, studentId) => {
    if (window.confirm('Remove this student from the classroom?')) {
      await dispatch(removeStudent({ classroomId, studentId }));
      dispatch(fetchMyClassrooms());
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Classrooms</h1>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingClassroom(null);
            setFormData({ name: '', subject: '', description: '' });
          }}
          className="btn-primary"
        >
          + Create Classroom
        </button>
      </div>

      {showCreateForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingClassroom ? 'Edit Classroom' : 'Create New Classroom'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Classroom Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
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
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="3"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="btn-primary">
                {editingClassroom ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingClassroom(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {classrooms.map(classroom => (
          <div key={classroom._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{classroom.name}</h3>
                <p className="text-gray-600">Subject: {classroom.subject}</p>
                {classroom.description && (
                  <p className="text-gray-500 mt-1">{classroom.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(classroom)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(classroom._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">
                  Students ({classroom.students?.length || 0})
                </h4>
                <button
                  onClick={() => setAddingStudentTo(
                    addingStudentTo === classroom._id ? null : classroom._id
                  )}
                  className="text-sm btn-primary"
                >
                  + Add Student
                </button>
              </div>

              {addingStudentTo === classroom._id && (
                <form
                  onSubmit={(e) => handleAddStudent(e, classroom._id)}
                  className="mb-3 flex gap-2"
                >
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="Student email"
                    className="input-field flex-1"
                    required
                  />
                  <button type="submit" className="btn-primary">Add</button>
                  <button
                    type="button"
                    onClick={() => setAddingStudentTo(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </form>
              )}

              {classroom.students && classroom.students.length > 0 ? (
                <div className="space-y-2">
                  {classroom.students.map(student => (
                    <div
                      key={student._id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="font-medium">{student.name}</span>
                        <span className="text-gray-500 ml-2">({student.email})</span>
                      </div>
                      <button
                        onClick={() => handleRemoveStudent(classroom._id, student._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No students enrolled yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {classrooms.length === 0 && !showCreateForm && (
        <div className="card text-center">
          <p className="text-gray-600 mb-4">No classrooms created yet.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create Your First Classroom
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassroomManager;