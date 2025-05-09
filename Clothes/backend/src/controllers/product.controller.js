import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

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
    console.log("Creating product:", { body: req.body, files: req.files });
    const { name, description, price, category, colors, sizes } = req.body;
    const images = req.files;

    if (!images?.length) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    // Upload images to Cloudinary sequentially to avoid rate limits
    const uploadedImages = [];
    for (const image of images) {
      try {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "printo/products",
          resource_type: "image",
        });
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        // Delete any uploaded images if one fails
        for (const img of uploadedImages) {
          await cloudinary.uploader.destroy(img.public_id);
        }
        throw new Error("Image upload failed");
      }
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      colors: JSON.parse(colors || "[]"),
      sizes: JSON.parse(sizes || "[]"),
      images: uploadedImages,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Product creation failed:", error);
    res.status(400).json({
      message: "Failed to create product",
      error: error.message,
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
