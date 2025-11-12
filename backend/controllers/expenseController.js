import Expense from "../models/Expense.js";

export const createExpense = async (req, res) => {
  try {
    const { description, amount } = req.body;
    const expense = await Expense.create({ description, amount });
    res.status(201).json({ message: "Expense recorded successfully", expense });
  } catch (error) {
    res.status(500).json({ message: "Error creating expense", error });
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
};
