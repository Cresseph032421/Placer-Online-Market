import express from 'express';
import { getProfile, updateUser, getProfileImage } from '../controllers/userController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/update', authenticateToken, updateUser);
router.get('/profile-image/:id', getProfileImage);

export default router;