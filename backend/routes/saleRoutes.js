import express from "express";
import { addFuelSale, getMyFuelSales, getAllFuelSales, getSalesTotals } from "../controllers/salesController.js";
import { protect, adminOnly, attendantOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Attendant can add sale
router.post("/", protect, attendantOnly, addFuelSale);

// Attendant can view their own sales
router.get("/my-sales", protect, attendantOnly, getMyFuelSales);

// Admin can view all sales
router.get("/all", protect, adminOnly, getAllFuelSales);

// Admin can view sales totals by attendant
router.get("/totals", protect, adminOnly, getSalesTotals);

export default router;
