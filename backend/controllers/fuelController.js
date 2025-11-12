// controllers/fuelController.js
import FuelType from "../models/FuelType.js";

// Create new fuel type
export const createFuel = async (req, res) => {
  try {
    const { name, pricePerLitre, quantityInStock } = req.body;

    const existingFuel = await FuelType.findOne({ where: { name } });
    if (existingFuel)
      return res.status(400).json({ message: "Fuel type already exists" });

    const fuel = await FuelType.create({ name, pricePerLitre, quantityInStock });

    res.status(201).json({ message: "Fuel type created successfully", fuel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all fuels
export const getAllFuels = async (req, res) => {
  try {
    const fuels = await FuelType.findAll();
    res.status(200).json(fuels);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get fuel by ID
export const getFuelById = async (req, res) => {
  try {
    const fuel = await FuelType.findByPk(req.params.id);
    if (!fuel) return res.status(404).json({ message: "Fuel type not found" });

    res.status(200).json(fuel);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update fuel
export const updateFuel = async (req, res) => {
  try {
    const { pricePerLitre, quantityInStock } = req.body;
    const fuel = await FuelType.findByPk(req.params.id);

    if (!fuel) return res.status(404).json({ message: "Fuel not found" });

    fuel.pricePerLitre = pricePerLitre ?? fuel.pricePerLitre;
    fuel.quantityInStock = quantityInStock ?? fuel.quantityInStock;
    fuel.lastUpdated = new Date();

    await fuel.save();
    res.status(200).json({ message: "Fuel updated successfully", fuel });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete fuel
export const deleteFuel = async (req, res) => {
  try {
    const fuel = await FuelType.findByPk(req.params.id);
    if (!fuel) return res.status(404).json({ message: "Fuel not found" });

    await fuel.destroy();
    res.status(200).json({ message: "Fuel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
