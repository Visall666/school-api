import express from 'express';
import { register, login, getAllUsers } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', authenticateToken, getAllUsers);

export default router;
