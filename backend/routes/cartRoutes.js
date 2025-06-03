import express from 'express';
import {
  getCart,
  updateCart,
//   clearCart,
//   removeCartItem
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas de carrinho requerem autenticação
router.use(protect);

// Rotas para gestão do carrinho
router.route('/')
  .get(getCart)
  .post(updateCart)
//   .delete(clearCart);

// Rota para remover item específico
// router.delete('/:productId', removeCartItem);

export default router;