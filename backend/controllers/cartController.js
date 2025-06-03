import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images');
    
    res.status(200).json({
      status: 'success',
      data: {
        cart: cart || { items: [] }
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar carrinho'
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Validações
    if (!productId || !quantity) {
      return res.status(400).json({
        status: 'fail',
        message: 'Por favor forneça productId e quantity'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Produto não encontrado'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    // Se não existir carrinho, cria um novo
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: []
      });
    }

    // Verifica se o produto já está no carrinho
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Atualiza quantidade
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Adiciona novo item
      cart.items.push({
        product: productId,
        quantity,
        priceAtAddition: product.price
      });
    }

    // Remove itens com quantidade <= 0
    cart.items = cart.items.filter(item => item.quantity > 0);

    await cart.save();
    
    const populatedCart = await Cart.populate(cart, {
      path: 'items.product',
      select: 'name price images'
    });

    res.status(200).json({
      status: 'success',
      data: {
        cart: populatedCart
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao atualizar carrinho'
    });
  }
};