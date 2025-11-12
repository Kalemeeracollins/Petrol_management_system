// controllers/maintenanceController.js
import Maintenance from "../models/Maintenance.js";
import User from "../models/User.js";

// Get all maintenance tasks
export const getAllMaintenance = async (req, res) => {
  try {
    const maintenances = await Maintenance.findAll({
      include: [
        {
          model: User,
          as: "attendant",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["scheduledDate", "ASC"], ["scheduledTime", "ASC"]],
    });
    res.json(maintenances);
  } catch (error) {
    console.error("Error fetching maintenance tasks:", error);
    res.status(500).json({ message: "Failed to fetch maintenance tasks" });
  }
};

// Create a new maintenance task
export const createMaintenance = async (req, res) => {
  try {
    const {
      attendantId,
      taskType,
      description,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
      priority,
      assignedPump,
      notes,
    } = req.body;

    // Validate attendant exists
    const attendant = await User.findByPk(attendantId);
    if (!attendant) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    const maintenance = await Maintenance.create({
      attendantId,
      taskType,
      description,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
      priority,
      assignedPump,
      notes,
    });

    const maintenanceWithAttendant = await Maintenance.findByPk(maintenance.id, {
      include: [
        {
          model: User,
          as: "attendant",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(201).json(maintenanceWithAttendant);
  } catch (error) {
    console.error("Error creating maintenance task:", error);
    res.status(500).json({ message: "Failed to create maintenance task" });
  }
};

// Update maintenance task status
export const updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const maintenance = await Maintenance.findByPk(id);
    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance task not found" });
    }

    await maintenance.update({ status });

    const updatedMaintenance = await Maintenance.findByPk(id, {
      include: [
        {
          model: User,
          as: "attendant",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json(updatedMaintenance);
  } catch (error) {
    console.error("Error updating maintenance status:", error);
    res.status(500).json({ message: "Failed to update maintenance status" });
  }
};

// Update maintenance task
export const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const maintenance = await Maintenance.findByPk(id);
    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance task not found" });
    }

    await maintenance.update(updateData);

    const updatedMaintenance = await Maintenance.findByPk(id, {
      include: [
        {
          model: User,
          as: "attendant",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json(updatedMaintenance);
  } catch (error) {
    console.error("Error updating maintenance task:", error);
    res.status(500).json({ message: "Failed to update maintenance task" });
  }
};

// Delete maintenance task
export const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const maintenance = await Maintenance.findByPk(id);
    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance task not found" });
    }

    await maintenance.destroy();
    res.json({ message: "Maintenance task deleted successfully" });
  } catch (error) {
    console.error("Error deleting maintenance task:", error);
    res.status(500).json({ message: "Failed to delete maintenance task" });
  }
};
