const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// Student routes
router.get('/my', auth, progressController.getMyProgress);

// Teacher routes
router.get('/classroom/:classroomId', auth, roleCheck(['teacher']), progressController.getClassroomProgress);
router.post('/', auth, roleCheck(['teacher']), progressController.createProgress);
router.put('/:progressId', auth, roleCheck(['teacher']), progressController.updateProgress);
router.delete('/:progressId', auth, roleCheck(['teacher']), progressController.deleteProgress);

module.exports = router;