import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true,
    maxlength: [100, 'O nome não pode ter mais que 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um email válido']
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória'],
    minlength: [6, 'A senha deve ter pelo menos 6 caracteres'],
    select: false // Não retorna a senha em consultas por padrão
  },
  isAdmin: {
    type: Boolean,
    default: false,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false
  },
  lastLogin: {
    type: Date,
    select: false
  },
  passwordChangedAt: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals para relacionamentos (opcional)
userSchema.virtual('cart', {
  ref: 'Cart',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

userSchema.virtual('favorites', {
  ref: 'Favorite',
  localField: '_id',
  foreignField: 'user'
});

// Middleware para hash da senha
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = Date.now() - 1000; // Ajuste para garantir token válido
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para verificar se a senha foi alterada após o token ser emitido
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Método para criar token de reset de senha
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
  
  return resetToken;
};

// Query middleware para filtrar usuários inativos
userSchema.pre(/^find/, function(next) {
  this.find({ isActive: { $ne: false } });
  next();
});

export default mongoose.model('User', userSchema);