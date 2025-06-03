import User from '../models/User.js';
export const getProfile = async (req, res) => {
  try {
    // Certifique-se de incluir isAdmin
    const user = await User.findById(req.user.id).select('+isAdmin');
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin, // Garantir que está incluído
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-__v -passwordChangedAt -passwordResetToken -passwordResetExpires');
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar informações do usuário'
    });
  }
};

export const updateMe = async (req, res, next) => {
  try {
    // 1) Criar erro se tentar atualizar senha
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'Esta rota não é para atualização de senha. Use /updatePassword.'
      });
    }

    // 2) Atualizar dados do usuário
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-__v -passwordChangedAt');

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao desativar conta'
    });
  }
};