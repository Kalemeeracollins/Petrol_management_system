import express from "express";
import { createExpense, getAllExpenses } from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", createExpense); 
router.get("/", getAllExpenses);

export default router;