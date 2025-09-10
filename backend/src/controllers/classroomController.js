const Classroom = require('../models/Classroom');
const User = require('../models/User');

// Get classrooms based on user role
exports.getMyClassrooms = async (req, res) => {
  try {
    let classrooms;
    
    if (req.userRole === 'teacher') {
      // Teachers see classrooms they own
      classrooms = await Classroom.find({ teacherId: req.userId })
        .populate('students', 'name email')
        .sort('-createdAt');
    } else {
      // Students see classrooms they're enrolled in
      classrooms = await Classroom.find({ students: req.userId })
        .populate('teacherId', 'name email')
        .select('-students')
        .sort('-createdAt');
    }
    
    res.json(classrooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create classroom (Teachers only)
exports.createClassroom = async (req, res) => {
  try {
    const { name, subject, description } = req.body;

    const classroom = new Classroom({
      name,
      subject,
      description,
      teacherId: req.userId,
      students: []
    });

    await classroom.save();
    res.status(201).json(classroom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add student to classroom (Teachers only)
exports.addStudent = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { studentEmail } = req.body;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    if (classroom.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find student by email
    const student = await User.findOne({ email: studentEmail, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if student already in classroom
    if (classroom.students.includes(student._id)) {
      return res.status(400).json({ message: 'Student already in classroom' });
    }

    classroom.students.push(student._id);
    await classroom.save();

    // Update student's classrooms
    student.classroomIds.push(classroom._id);
    await student.save();

    res.json({ message: 'Student added successfully', classroom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove student from classroom (Teachers only)
exports.removeStudent = async (req, res) => {
  try {
    const { classroomId, studentId } = req.params;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    if (classroom.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    classroom.students = classroom.students.filter(
      id => id.toString() !== studentId
    );
    await classroom.save();

    // Update student's classrooms
    const student = await User.findById(studentId);
    if (student) {
      student.classroomIds = student.classroomIds.filter(
        id => id.toString() !== classroomId
      );
      await student.save();
    }

    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update classroom (Teachers only)
exports.updateClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const updates = req.body;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    if (classroom.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== 'teacherId' && key !== 'students') {
        classroom[key] = updates[key];
      }
    });

    await classroom.save();
    res.json(classroom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete classroom (Teachers only)
exports.deleteClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    if (classroom.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await classroom.deleteOne();
    res.json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};