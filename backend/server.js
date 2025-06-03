import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path'; 
import { fileURLToPath } from 'url';

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js'; // Nova rota
import favoriteRoutes from './routes/favoriteRoutes.js'; // Nova rota
import { errorHandler, notFound } from './middleware/errorMiddleware.js'; // Middlewares de erro

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Inicialização do Express
const app = express();

// Configuração avançada do CORS
const configureCors = () => {
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_PROD_URL]
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Authorization']
  };
};

// Middlewares
app.use(cors(configureCors()));
app.options('*', cors(configureCors()));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MongoDB com tratamento melhorado
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('Conectado ao MongoDB com sucesso');
    
    // Verifica conexão
    mongoose.connection.on('connected', () => {
      console.log('Mongoose conectado ao DB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('Erro na conexão do Mongoose:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose desconectado do DB');
    });
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
};

// Rotas
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes); // Nova rota para carrinho
app.use('/api/favorites', favoriteRoutes); // Nova rota para favoritos

// Rota de health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Middlewares de erro (deve vir depois das rotas)
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Aplicação encerrada');
  process.exit(0);
});

// Inicialização do servidor
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
  });

  // Timeout para evitar conexões pendentes
  server.setTimeout(10000);
};

startServer();