import express from 'express';
import {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} from '../controllers/student.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, createStudent);
router.get('/', authenticateToken, getAllStudents);
router.get('/:id', authenticateToken, getStudentById);
router.put('/:id', authenticateToken, updateStudent);
router.delete('/:id', authenticateToken, deleteStudent);

export default router;
