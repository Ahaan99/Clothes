import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("[Auth Middleware] Auth header:", authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[Auth Middleware] Decoded token:", decoded);

    // Convert string ID to ObjectId
    const userId = new mongoose.Types.ObjectId(decoded.id);
    const user = await User.findById(userId).select("-password");

    if (!user) {
      console.log("[Auth Middleware] User not found for id:", decoded.id);
      return res.status(401).json({
        message: "Session expired, please login again",
        code: "SESSION_EXPIRED",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("[Auth Middleware] Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired, please login again",
        code: "TOKEN_EXPIRED",
      });
    }
    res.status(401).json({ message: "Authentication failed" });
  }
};

export const admin = (req, res, next) => {
  if (!req.user) {
    console.log("[Admin Middleware] No user in request");
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!req.user.isAdmin) {
    console.log("[Admin Middleware] User not admin:", req.user._id);
    return res.status(403).json({ message: "Not authorized as admin" });
  }

  console.log("[Admin Middleware] Admin access granted:", req.user._id);
  next();
};
