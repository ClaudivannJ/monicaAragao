import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// 📦 Público (clientes)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// 🔐 Admin - Com upload de imagem
router.post(
  '/',
  protect,
  restrictTo('admin'),
  uploadProductImage,
  createProduct
);

router.patch(
  '/:id',
  protect,
  restrictTo('admin'),
  uploadProductImage,
  updateProduct
);

router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router;