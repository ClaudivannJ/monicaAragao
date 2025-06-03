import Product from '../models/Product.js';
import { upload, processImage } from '../config/fileUpload.js';
import fs from 'fs';

// Middleware de upload para criar produto
export const uploadProductImage = (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
    
    if (!req.file) {
      return next(); // Permite continuar sem imagem se não for obrigatório
    }

    try {
      // Processa a imagem (opcional)
      const processedPath = await processImage(req.file.path);
      
      req.imageData = {
        url: `/uploads/products/${path.basename(processedPath)}`,
        path: processedPath
      };
      next();
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao processar imagem'
      });
    }
  });
};

// 🛠️ Criar produto (apenas admin)
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      image: req.imageData?.url || req.body.image,
      imagePath: req.imageData?.path
    };

    const product = new Product(productData);
    const newProduct = await product.save();

    res.status(201).json({
      status: 'success',
      data: { product: newProduct }
    });
  } catch (error) {
    // Remove a imagem se houve erro
    if (req.imageData?.path) fs.unlinkSync(req.imageData.path);
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// 🔄 Atualizar produto (apenas admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      if (req.imageData?.path) fs.unlinkSync(req.imageData.path);
      return res.status(404).json({
        status: 'fail',
        message: 'Produto não encontrado'
      });
    }

    const updateData = { ...req.body };
    
    if (req.imageData) {
      // Remove a imagem antiga se existir
      if (product.imagePath && fs.existsSync(product.imagePath)) {
        fs.unlinkSync(product.imagePath);
      }
      
      updateData.image = req.imageData.url;
      updateData.imagePath = req.imageData.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { product: updatedProduct }
    });
  } catch (error) {
    if (req.imageData?.path) fs.unlinkSync(req.imageData.path);
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};


// 🔎 Buscar todos os produtos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar produtos'
    });
  }
};

// 🔎 Buscar produto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Produto não encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar produto'
    });
  }
};
// ❌ Deletar produto (com remoção da imagem)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Produto não encontrado'
      });
    }

    // Remove a imagem associada
    if (product.imagePath && fs.existsSync(product.imagePath)) {
      fs.unlinkSync(product.imagePath);
    }

    res.status(200).json({
      status: 'success',
      message: 'Produto deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};