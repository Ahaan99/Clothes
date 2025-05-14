import express from "express";
import { protect, admin } from "../middleware/auth.middleware.js";
import { upload } from "../config/multer.js";
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
} from "../controllers/product.controller.js";
import Product from "../models/product.model.js";

const router = express.Router();

router.post("/", protect, admin, upload.array("images", 5), createProduct);

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.get("/:id", getProductById);
router.delete("/:id", protect, admin, deleteProduct);

// Update product
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
