import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Helper para criar token JWT
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      // passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    // Remove a senha do output
    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (err) {
    // Tratamento de erros do Mongoose
    if (err.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email já está em uso'
      });
    }
    res.status(400).json({
      status: 'fail',
      message: err.message
     
    }); console.log(err.message)
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)

    // 1) Verifica se email e senha existem
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Por favor, forneça seu usuario e senha'
      });
    }

    // 2) Verifica se usuário existe e senha está correta
    const user = await User.findOne({ email }).select('+password +isAdmin');

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Email ou senha incorretos'
      });
    }

    // 3) Atualiza lastLogin
    user.lastLogin = Date.now();
    await user.save();

    // 4) Se tudo ok, envia token
    const token = signToken(user._id);
    
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
    console.log(err.message)
  }
};

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 *1000),
    httpOnly: true
  });
  res.status(200).json({status: 'sucess'});
}