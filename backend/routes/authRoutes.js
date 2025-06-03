import express from 'express';
import {
  signup,
  login,
  logout,
//   forgotPassword,
//   resetPassword,
//   updatePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rotas de autenticação
router.post('/register', signup);
router.post('/login', login);
router.get('/logout', protect, logout); // Logout requer autenticação

// Rotas para gestão de senha
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);
// router.post('/update-password', protect, updatePassword); // Atualizar senha requer autenticação

export default router;