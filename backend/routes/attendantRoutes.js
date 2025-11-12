import express from "express";
import { syncAttendants, getAllAttendants, assignPump, removePump, getMyPump } from "../controllers/attendantController.js";
import { protect, adminOnly, attendantOnly } from "../middleware/authMiddleware.js";
// Correct import
const router = express.Router();

// Admin-only route to sync attendants
router.post("/sync", protect, adminOnly, syncAttendants);

// Get all attendants
router.get("/", protect, getAllAttendants);
router.get("/me", protect, attendantOnly, getMyPump);
router.put("/:id/assign-pump", protect, adminOnly, assignPump);
router.put("/:id/remove-pump", protect, adminOnly, removePump);
export default router;
