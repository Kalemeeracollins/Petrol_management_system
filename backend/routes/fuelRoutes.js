// routes/fuelRoutes.js
import express from "express";
import { createFuel, getAllFuels, getFuelById, updateFuel, deleteFuel } from "../controllers/fuelController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// CRUD routes
router.post("/", protect, adminOnly, createFuel);
router.get("/", getAllFuels);
router.get("/:id", getFuelById);
router.put("/:id", protect, adminOnly, updateFuel);
router.delete("/:id", protect, adminOnly, deleteFuel);

export default router;
