import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../src/utils/appError.js';

export const protect = async (req, res, next) => {
  try {
    // 1) Verifica se o token existe
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Você não está logado. Por favor faça login para acessar.'
      });
    }

    // 2) Verifica o token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // 3) Verifica se usuário ainda existe
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'O usuário deste token não existe mais.'
      });
    }

    // 4) Verifica se usuário mudou a senha após o token ser emitido
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'Usuário recentemente mudou a senha! Por favor faça login novamente.'
      });
    }

    // Concede acesso à rota protegida
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Sessão inválida ou expirada. Por favor faça login novamente.'
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Você não tem permissão para executar esta ação'
      });
    }
    next();
  };
};