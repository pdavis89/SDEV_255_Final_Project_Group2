const express = require('express');
const courseController = require('../controllers/courseController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/courses', courseController.getCourses);
router.get('/courses/my/schedule', authenticate, requireRole('student'), courseController.getMySchedule);
router.get('/courses/:id', courseController.getCourseById);
router.post('/courses', authenticate, requireRole('professor'), courseController.createCourse);
router.put('/courses/:id', authenticate, requireRole('professor'), courseController.updateCourse);
router.delete('/courses/:id', authenticate, requireRole('professor'), courseController.deleteCourse);
router.post('/courses/:id/enroll', authenticate, requireRole('student'), courseController.enrollInCourse);
router.delete('/courses/:id/enroll', authenticate, requireRole('student'), courseController.dropCourse);

module.exports = router;
