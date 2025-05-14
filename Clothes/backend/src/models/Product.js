import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: 0,
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    required: [true, "Gender is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ['t-shirts', 'hoodies', 'tops', 'shirts', 'tank-tops', 'jackets', 'sweaters', 'dresses', 'blouses', 'polo'],
  },
  images: [{
    url: String,
    public_id: String
  }],
  colors: [{
    name: String,
    hex: String
  }],
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Product = mongoose.model("Product", productSchema);
