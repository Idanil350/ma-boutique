import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'XAF', 'USD']
  },
  category: {
    type: String,
    required: true,
    enum: ['chaussures-homme', 'chaussures-femme', 'perruques', 'sacs-femme', 'tech-ai', 'consoles', 'hygiene']
  },
  image: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)