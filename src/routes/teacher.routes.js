import express from 'express';
import {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
} from '../controllers/teacher.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, createTeacher);
router.get('/', authenticateToken, getAllTeachers);
router.get('/:id', authenticateToken, getTeacherById);
router.put('/:id', authenticateToken, updateTeacher);
router.delete('/:id', authenticateToken, deleteTeacher);

export default router;
