import express from 'express';
import {
  signup,
  login,
  getProfile,
  getAllUsers,
  requestPasswordReset,
  resetPassword,
} from '../controllers/auth.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authenticate, getProfile);

// Admin routes
router.get('/admin/users', authenticate, isAdmin, getAllUsers);

export default router;
