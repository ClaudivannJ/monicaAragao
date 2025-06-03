import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome do produto é obrigatório']
  },
  description: {
    type: String,
    required: [true, 'A descrição é obrigatória']
  },
  price: {
    type: Number,
    required: [true, 'O preço é obrigatório'],
    min: [0, 'O preço não pode ser negativo']
  },
  type: {
    type: String,
    required: true,
    enum: ['anel', 'brinco', 'colar', 'pulseira', 'perfume']
  },
  image: {
    type: String,
    required: [true, 'A imagem é obrigatória']
  },
  imagePath: { // Novo campo para armazenar o caminho do arquivo
    type: String,
    select: false
  }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);