import express from 'express';
import {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} from '../controllers/course.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, createCourse);
router.get('/', authenticateToken, getAllCourses);
router.get('/:id', authenticateToken, getCourseById);
router.put('/:id', authenticateToken, updateCourse);
router.delete('/:id', authenticateToken, deleteCourse);

export default router;
