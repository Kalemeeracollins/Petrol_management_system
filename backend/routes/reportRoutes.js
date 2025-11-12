import express from "express";
import { getReport, getDashboardAnalytics } from "../controllers/reportController.js";

const router = express.Router();

router.get("/", getReport);
router.get("/dashboard", getDashboardAnalytics);

export default router;
