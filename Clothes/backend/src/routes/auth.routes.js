import express from "express";
import { adminLogin, createAdmin } from "../controllers/auth.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/admin/create", protect, admin, createAdmin);

export default router;
