import express from "express";
import { getAllUsers, toggleUserStatus } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

router.get("/", getAllUsers);
router.put("/:userId/toggle-status", toggleUserStatus);

export default router;
