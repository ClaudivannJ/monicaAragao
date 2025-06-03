import Favorite from '../models/Favorite.js';
import Product from '../models/Product.js';

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate('product', 'name price images');
    
    res.status(200).json({
      status: 'success',
      results: favorites.length,
      data: {
        favorites
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar favoritos'
    });
  }
};

export const checkFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user.id,
      product: productId
    });

    res.status(200).json({
      status: 'success',
      data: {
        isFavorite: !!favorite
      }
    });
  } catch (err) {
    next(new AppError('Erro ao verificar favorito', 500));
  }
};
export const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Por favor forneça um productId'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Produto não encontrado'
      });
    }

    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingFavorite) {
      await Favorite.deleteOne({ _id: existingFavorite._id });
      return res.status(200).json({
        status: 'success',
        message: 'Produto removido dos favoritos',
        isFavorite: false
      });
    }

    const newFavorite = await Favorite.create({
      user: req.user.id,
      product: productId
    });

    res.status(201).json({
      status: 'success',
      message: 'Produto adicionado aos favoritos',
      data: {
        favorite: newFavorite
      },
      isFavorite: true
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao atualizar favoritos'
    });
  }
};