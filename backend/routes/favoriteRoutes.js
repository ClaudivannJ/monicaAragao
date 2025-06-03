import express from 'express';
import {
  getFavorites,
  toggleFavorite,
  checkFavorite
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas de favoritos requerem autenticação
router.use(protect);

// Rotas para gestão de favoritos
router.route('/')
  .get(getFavorites);

router.route('/:productId')
  .get(checkFavorite)
  .post(toggleFavorite)
  .delete(toggleFavorite);

export default router;