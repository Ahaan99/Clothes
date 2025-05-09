import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import { initializeAdmin } from "../init/adminInit.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB()
  .then(async () => {
    console.log("MongoDB Connected");
    await initializeAdmin(true); // Force recreate admin
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Printo API" });
});

// Routes with API prefix - update these lines
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes); // This ensures /api/products works

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
