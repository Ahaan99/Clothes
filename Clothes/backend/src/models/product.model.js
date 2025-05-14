import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "t-shirts",
        "hoodies",
        "tanks",
        "sweatshirts",
        "long-sleeves",
        "polo",
      ],
    },
    colors: [
      {
        name: String,
        hex: String,
      },
    ],
    sizes: [
      {
        type: String,
        enum: ["XS", "S", "M", "L", "XL"],
      },
    ],
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Check if model exists before compiling
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
