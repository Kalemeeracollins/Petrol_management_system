import FuelSale from "../models/Sale.js";
import Fuel from "../models/FuelType.js";
import User from "../models/User.js";
import sequelize from "../config/db.js";

// Add new sale
export const addFuelSale = async (req, res) => {
  try {
    const { fuelTypeId, quantitySold, totalAmount, pumpNumber } = req.body;
    const attendantId = req.user.id; // from authentication middleware

    // Validate existence of fuel
    const fuel = await Fuel.findByPk(fuelTypeId);
    if (!fuel) {
      return res.status(404).json({ message: "Fuel type not found" });
    }

    // Check if sufficient stock is available
    if (fuel.quantityInStock < quantitySold) {
      return res.status(400).json({ message: "Insufficient fuel stock available" });
    }

    // Creative validation: Check if attendant is on an active shift using new Shift model
    const Shift = (await import("../models/Shift.js")).default;
    const activeShift = await Shift.findOne({
      where: { attendantId, status: "IN_PROGRESS" },
    });
    if (!activeShift) {
      return res.status(403).json({ message: "You must be on an active shift to record sales" });
    }

    // Create the sale
    const sale = await FuelSale.create({
      fuelTypeId,
      attendantId,
      quantitySold,
      totalAmount,
      pumpNumber,
    });

    // Decrement the fuel stock
    fuel.quantityInStock -= quantitySold;
    await fuel.save();

    res.status(201).json({ message: "Fuel sale recorded successfully", sale });
  } catch (error) {
    console.error("Error adding fuel sale:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all sales (Admin)
export const getAllFuelSales = async (req, res) => {
  try {
    const sales = await FuelSale.findAll({
      include: [
        { model: User, as: "attendant", attributes: ["id", "name", "email"] },
        { model: Fuel, as: "fuelType", attributes: ["id", "name", "pricePerLitre"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error: error.message });
  }
};

// Get logged-in attendant's sales
export const getMyFuelSales = async (req, res) => {
  try {
    const sales = await FuelSale.findAll({
      where: { attendantId: req.user.id },
      include: [{ model: Fuel, as: "fuelType", attributes: ["name", "pricePerLitre"] }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your sales" });
  }
};

// Get sales totals by attendant (Admin only)
export const getSalesTotals = async (req, res) => {
  try {
    const totals = await FuelSale.findAll({
      attributes: [
        'attendantId',
        [sequelize.fn('SUM', sequelize.col('quantitySold')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalSales']
      ],
      include: [
        { model: User, as: "attendant", attributes: ["id", "name", "email"] }
      ],
      group: ['attendantId', 'attendant.id', 'attendant.name', 'attendant.email'],
      order: [[sequelize.fn('SUM', sequelize.col('totalAmount')), 'DESC']],
      raw: true
    });

    // Transform the raw results to match expected format
    const formattedTotals = totals.map(total => ({
      attendantId: total.attendantId,
      totalQuantity: parseFloat(total.totalQuantity) || 0,
      totalAmount: parseFloat(total.totalAmount) || 0,
      totalSales: parseInt(total.totalSales) || 0,
      attendant: {
        id: total['attendant.id'],
        name: total['attendant.name'],
        email: total['attendant.email']
      }
    }));

    res.status(200).json(formattedTotals);
  } catch (error) {
    console.error("Error fetching sales totals:", error);
    res.status(500).json({ message: "Error fetching sales totals", error: error.message });
  }
};
