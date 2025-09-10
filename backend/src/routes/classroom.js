const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// Both students and teachers can view their classrooms
router.get('/my', auth, classroomController.getMyClassrooms);

// Teacher-only routes
router.post('/', auth, roleCheck(['teacher']), classroomController.createClassroom);
router.post('/:classroomId/students', auth, roleCheck(['teacher']), classroomController.addStudent);
router.delete('/:classroomId/students/:studentId', auth, roleCheck(['teacher']), classroomController.removeStudent);
router.put('/:classroomId', auth, roleCheck(['teacher']), classroomController.updateClassroom);
router.delete('/:classroomId', auth, roleCheck(['teacher']), classroomController.deleteClassroom);

module.exports = router;