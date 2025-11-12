// routes/shiftRoutes.js
import express from "express";
import {
  createShift,
  getAllShifts,
  getAttendantShifts,
  startShift,
  endShift,
  updateShift,
  deleteShift,
  markShiftMissed,
  getShiftAnalytics,
  cancelShift
} from "../controllers/shiftController.js";
import { protect, adminOnly, attendantOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------
// Attendant routes
// -------------------
router.get("/my-shifts", protect, attendantOnly, getAttendantShifts);
router.put("/start/:shiftId", protect, attendantOnly, startShift);
router.put("/end/:shiftId", protect, attendantOnly, endShift);
router.put("/cancel/:shiftId", protect, attendantOnly, cancelShift);

// -------------------
// Admin routes
// -------------------
router.post("/", protect, adminOnly, createShift);
router.get("/", protect, adminOnly, getAllShifts);
router.put("/:shiftId", protect, adminOnly, updateShift);
router.delete("/:shiftId", protect, adminOnly, deleteShift);
router.put("/:shiftId/missed", protect, adminOnly, markShiftMissed);
router.put("/:shiftId/cancel", protect, adminOnly, cancelShift);

// Creative: Analytics route
router.get("/analytics", protect, adminOnly, getShiftAnalytics);

export default router;
