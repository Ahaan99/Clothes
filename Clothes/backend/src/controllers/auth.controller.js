import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const adminLogin = async (req, res) => {
  try {
    console.log("Admin login attempt:", req.body);
    const { email, password } = req.body;

    const admin = await User.findOne({ email, isAdmin: true });
    console.log("Found admin:", admin ? "yes" : "no");

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await admin.matchPassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = admin.generateToken();
    const userData = admin.toAuthJSON();
    console.log("Login successful, sending response:", { userData, token });

    res.json({
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: true,
      },
      token,
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    res.status(500).json({ message: "Failed to create admin" });
  }
};
