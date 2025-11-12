// routes/authRoutes.js
import express from "express";
import { login, register, logout, getMe } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", protect, adminOnly, register);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
