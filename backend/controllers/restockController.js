import Restock from "../models/Restock.js";
import FuelType from "../models/FuelType.js";
import User from "../models/User.js";

// Add restock record and update fuel stock
export const addRestock = async (req, res) => {
  try {
    const { fuelTypeId, attendantId, quantityAdded, supplierName, invoiceNumber, notes } = req.body;

    // Validate fuel exists
    const fuel = await FuelType.findByPk(fuelTypeId);
    if (!fuel) {
      return res.status(404).json({ message: "Fuel type not found" });
    }

    // Validate attendant exists
    const attendant = await User.findByPk(attendantId);
    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    // Create restock record
    const restock = await Restock.create({
      fuelTypeId,
      attendantId,
      quantityAdded,
      supplierName,
      invoiceNumber,
      notes,
      restockDate: new Date(),
    });

    // Update fuel stock
    fuel.quantityInStock = parseFloat(fuel.quantityInStock) + parseFloat(quantityAdded);
    await fuel.save();

    res.status(201).json({
      message: "Fuel restocked successfully",
      restock,
      updatedFuel: {
        id: fuel.id,
        name: fuel.name,
        quantityInStock: fuel.quantityInStock,
      },
    });
  } catch (error) {
    console.error("Error adding restock:", error);
    res.status(500).json({ message: "Error adding restock", error: error.message });
  }
};

// Get all restock records
export const getAllRestocks = async (req, res) => {
  try {
    const restocks = await Restock.findAll({
      include: [
        { model: FuelType, as: "fuelType", attributes: ["id", "name", "pricePerLitre"] },
        { model: User, as: "attendant", attributes: ["id", "name", "email"] },
      ],
      order: [["restockDate", "DESC"]],
    });

    res.status(200).json(restocks);
  } catch (error) {
    console.error("Error fetching restocks:", error);
    res.status(500).json({ message: "Error fetching restock records", error: error.message });
  }
};

// Get restock record by ID
export const getRestockById = async (req, res) => {
  try {
    const restock = await Restock.findByPk(req.params.id, {
      include: [
        { model: FuelType, as: "fuelType", attributes: ["id", "name", "pricePerLitre"] },
        { model: User, as: "attendant", attributes: ["id", "name", "email"] },
      ],
    });

    if (!restock) {
      return res.status(404).json({ message: "Restock record not found" });
    }

    res.status(200).json(restock);
  } catch (error) {
    console.error("Error fetching restock:", error);
    res.status(500).json({ message: "Error fetching restock record", error: error.message });
  }
};
