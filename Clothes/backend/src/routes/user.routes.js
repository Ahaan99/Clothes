import express from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import { register, login, getProfile, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
