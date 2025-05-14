import { Product } from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, gender, colors, sizes, stock } = req.body;

    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(file.path, {
            folder: 'printo/products'
          }, (error, result) => {
            // Delete temp file
            fs.unlinkSync(file.path);
            
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              public_id: result.public_id
            });
          });
        });
      });

      images = await Promise.all(uploadPromises);
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      gender: gender || 'unisex', // Set default gender
      colors: JSON.parse(colors),
      sizes: JSON.parse(sizes),
      stock: Number(stock),
      images,
      createdBy: req.user._id
    });

    res.status(201).json(product);
  } catch (error) {
    // Delete uploaded files if product creation fails
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    console.error("Error creating product:", error);
    res.status(400).json({ 
      message: "Failed to create product", 
      error: error.message 
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from Cloudinary
    const deletePromises = product.images.map((image) =>
      cloudinary.uploader.destroy(image.public_id)
    );

    await Promise.all(deletePromises);
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
