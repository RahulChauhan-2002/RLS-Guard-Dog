const Progress = require('../models/Progress');
const Classroom = require('../models/Classroom');

// RLS Implementation: Students can only see their own progress
exports.getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ studentId: req.userId })
      .populate('classroomId', 'name subject')
      .sort('-lastUpdated');
    
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teachers can see all progress in their classrooms
exports.getClassroomProgress = async (req, res) => {
  try {
    const { classroomId } = req.params;
    
    // Verify teacher owns this classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    
    if (classroom.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const progress = await Progress.find({ classroomId })
      .populate('studentId', 'name email')
      .sort('studentId');
    
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teachers can update student progress
exports.updateProgress = async (req, res) => {
  try {
    const { progressId } = req.params;
    const updates = req.body;

    // Find progress and verify teacher has access
    const progress = await Progress.findById(progressId)
      .populate('classroomId');
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    if (progress.classroomId.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update progress
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== 'studentId' && key !== 'classroomId') {
        progress[key] = updates[key];
      }
    });

    await progress.save();
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new progress entry (Teachers only)
exports.createProgress = async (req, res) => {
  try {
    const { studentId, classroomId, subject, score, completedModules, totalModules } = req.body;

    // Verify teacher owns this classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    
    if (classroom.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if student is in classroom
    if (!classroom.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student not in this classroom' });
    }

    const progress = new Progress({
      studentId,
      classroomId,
      subject,
      score,
      completedModules: completedModules || [],
      totalModules: totalModules || 0
    });

    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete progress (Teachers only)
exports.deleteProgress = async (req, res) => {
  try {
    const { progressId } = req.params;

    const progress = await Progress.findById(progressId)
      .populate('classroomId');
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    if (progress.classroomId.teacherId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await progress.deleteOne();
    res.json({ message: 'Progress deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};