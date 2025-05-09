import express from "express";
import multer from "multer";
import { protect, admin } from "../middleware/auth.middleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
} from "../controllers/product.controller.js";

// Configure multer for memory storage
const upload = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

const router = express.Router();

router.post("/", protect, admin, upload.array("images", 5), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
