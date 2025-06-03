import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  // getMe,
  updateMe,
  deleteMe,
  getProfile
} from '../controllers/userController.js';

const router = express.Router();

// Rotas para gestão do perfil do usuário
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateMe)
  .delete(protect, deleteMe);

export default router;