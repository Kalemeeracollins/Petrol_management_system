import db from "../config/db.js"; // mysql2 promise pool
import { QueryTypes } from "sequelize";
import Attendant from "../models/attendantModel.js";

// Sync attendants from users table
export const syncAttendants = async (req, res) => {
  try {
    const users = await db.query(
      "SELECT * FROM users WHERE role = 'ATTENDANT'",
      { type: QueryTypes.SELECT }
    );

    for (const user of users) {
      const existing = await db.query(
        "SELECT * FROM attendants WHERE email = :email",
        {
          replacements: { email: user.email },
          type: QueryTypes.SELECT,
        }
      );

      if (existing.length === 0) {
        await db.query(
          "INSERT INTO attendants (name, email, phone, password) VALUES (:name, :email, :phone, :password)",
          {
            replacements: {
              name: user.name,
              email: user.email,
              phone: user.phone || "",
              password: user.password,
            },
            type: QueryTypes.INSERT,
          }
        );
      }
    }

    res.json({ message: "Attendants synced successfully." });
  } catch (error) {
    console.error("Sync attendants error:", error);
    res.status(500).json({ message: "Error syncing attendants", error: error.message });
  }
};

// Get all attendants
export const getAllAttendants = async (req, res) => {
  try {
    const [attendants] = await db.query("SELECT * FROM attendants");
    res.json(attendants);
  } catch (error) {
    console.error("Get all attendants error:", error);
    res.status(500).json({ message: "Failed to fetch attendants", error: error.message });
  }
};

// Get all attendants with pump info
export const getAllAttendantsWithPumps = async (req, res) => {
  try {
    const attendants = await Attendant.findAll(); // Sequelize model
    res.json(attendants);
  } catch (err) {
    console.error("Get attendants with pumps error:", err);
    res.status(500).json({ message: "Failed to fetch attendants", error: err.message });
  }
};

// Assign a pump to an attendant
export const assignPump = async (req, res) => {
  const attendantId = parseInt(req.params.id, 10);
  const { pumpNumber, pumpName, pumpNotes } = req.body;

  console.log("Assign pump request:", { attendantId, pumpNumber, pumpName, pumpNotes });

  if (!attendantId) return res.status(400).json({ message: "Attendant ID is required" });
  if (!pumpNumber) return res.status(400).json({ message: "Pump number is required" });

  try {
    await db.query(
      `UPDATE attendants 
       SET pumpNumber = :pumpNumber, pumpName = :pumpName, pumpNotes = :pumpNotes, pumpAssignedAt = NOW() 
       WHERE id = :attendantId`,
      {
        replacements: {
          pumpNumber,
          pumpName: pumpName || null,
          pumpNotes: pumpNotes || null,
          attendantId,
        },
        type: QueryTypes.UPDATE,
      }
    );

    const [attendant] = await db.query(
      "SELECT * FROM attendants WHERE id = :attendantId",
      {
        replacements: { attendantId },
        type: QueryTypes.SELECT,
      }
    );

    res.json(attendant || { message: "Attendant updated but not found" });
  } catch (err) {
    console.error("Assign pump error:", err);
    res.status(500).json({ message: "Failed to assign pump", error: err.message });
  }
};

// Remove pump assignment from attendant
export const removePump = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      `UPDATE attendants
       SET pumpNumber = NULL,
           pumpName = NULL,
           pumpNotes = NULL,
           pumpAssignedAt = NULL
       WHERE id = :id`,
      {
        replacements: { id: parseInt(id, 10) },
        type: QueryTypes.UPDATE,
      }
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Attendant not found" });
    }

    res.json({ message: "Pump successfully unassigned" });
  } catch (error) {
    console.error("Error removing pump:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get pump assigned to the logged-in attendant
export const getMyPump = async (req, res) => {
  try {
    const [attendant] = await db.query("SELECT * FROM attendants WHERE email = ?", [req.user.email]);
    if (!attendant || attendant.length === 0)
      return res.status(404).json({ message: "Attendant not found" });
    res.json(attendant[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendant data" });
  }
};