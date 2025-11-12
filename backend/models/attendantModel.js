import db from "../config/db.js";

const Attendant = {
  // Fetch all attendants
  async getAll() {
    try {
      const [rows] = await db.query("SELECT * FROM attendants");
      return rows;
    } catch (err) {
      console.error("Error fetching attendants:", err);
      throw err;
    }
  },

  // Fetch a single attendant by ID
  async getById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM attendants WHERE id = ?", [id]);
      return rows[0] || null;
    } catch (err) {
      console.error(`Error fetching attendant ${id}:`, err);
      throw err;
    }
  },

  // Create a new attendant
  async create(data) {
    try {
      const { name, email, phone, password } = data;
      const [result] = await db.query(
        `INSERT INTO attendants (name, email, phone, password) VALUES (?, ?, ?, ?)`,
        [name, email, phone, password]
      );
      return { id: result.insertId, ...data };
    } catch (err) {
      console.error("Error creating attendant:", err);
      throw err;
    }
  },

  // Update attendant info (basic details only)
  async update(id, data) {
    try {
      const { name, email, phone } = data;
      await db.query(
        "UPDATE attendants SET name = ?, email = ?, phone = ? WHERE id = ?",
        [name, email, phone, id]
      );
      return this.getById(id);
    } catch (err) {
      console.error(`Error updating attendant ${id}:`, err);
      throw err;
    }
  },

  // Delete an attendant
  async delete(id) {
    try {
      await db.query("DELETE FROM attendants WHERE id = ?", [id]);
      return { message: "Attendant deleted" };
    } catch (err) {
      console.error(`Error deleting attendant ${id}:`, err);
      throw err;
    }
  },

  // Assign a pump to an attendant
  async assignPump(id, pumpData) {
    try {
      const { pumpNumber, pumpName, pumpNotes } = pumpData;

      await db.query(
        `UPDATE attendants
         SET pumpNumber = ?, pumpName = ?, pumpNotes = ?, pumpAssignedAt = NOW()
         WHERE id = ?`,
        [pumpNumber, pumpName || null, pumpNotes || null, id]
      );

      return this.getById(id);
    } catch (err) {
      console.error(`Error assigning pump to attendant ${id}:`, err);
      throw err;
    }
  },

  // Remove pump assignment
  async removePumpAssignment(id) {
    try {
      await db.query(
        `UPDATE attendants
         SET pumpNumber = NULL, pumpName = NULL, pumpNotes = NULL, pumpAssignedAt = NULL
         WHERE id = ?`,
        [id]
      );

      return this.getById(id);
    } catch (err) {
      console.error(`Error removing pump assignment for attendant ${id}:`, err);
      throw err;
    }
  },
};

export default Attendant;
