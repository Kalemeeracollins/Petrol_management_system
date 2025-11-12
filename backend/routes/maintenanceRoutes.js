// routes/maintenanceRoutes.js
import express from "express";
import {
  getAllMaintenance,
  createMaintenance,
  updateMaintenanceStatus,
  updateMaintenance,
  deleteMaintenance,
} from "../controllers/maintenanceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All maintenance routes require authentication
router.use(protect);

// Get all maintenance tasks (admin only)
router.get("/", adminOnly, getAllMaintenance);

// Create new maintenance task (admin only)
router.post("/", adminOnly, createMaintenance);

// Update maintenance task status
router.put("/:id/status", updateMaintenanceStatus);

// Update maintenance task (admin only)
router.put("/:id", adminOnly, updateMaintenance);

// Delete maintenance task (admin only)
router.delete("/:id", adminOnly, deleteMaintenance);

export default router;
