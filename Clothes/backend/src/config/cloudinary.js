import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Add CORS settings for Cloudinary
cloudinary.config({
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});

export default cloudinary;
