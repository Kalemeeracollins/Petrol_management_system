import express from "express";
import { addRestock, getAllRestocks, getRestockById } from "../controllers/restockController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Restock routes
router.post("/", protect, adminOnly, addRestock);
router.get("/", protect, adminOnly, getAllRestocks);
router.get("/:id", protect, adminOnly, getRestockById);

export default router;
