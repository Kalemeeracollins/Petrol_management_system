import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Attendant = sequelize.define("Attendant", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "ATTENDANT" },

  // Pump info
  pumpNumber: { type: DataTypes.STRING },
  pumpName: { type: DataTypes.STRING },
  pumpNotes: { type: DataTypes.TEXT },
  pumpAssignedAt: { type: DataTypes.DATE },

  // Shift info
  shiftType: { type: DataTypes.ENUM("MORNING", "AFTERNOON", "NIGHT") },
  scheduledDate: { type: DataTypes.DATEONLY },
  scheduledStartTime: { type: DataTypes.TIME },
  scheduledEndTime: { type: DataTypes.TIME },
  actualStartTime: { type: DataTypes.DATE },
  actualEndTime: { type: DataTypes.DATE },
  status: { type: DataTypes.ENUM("SCHEDULED","IN_PROGRESS","COMPLETED","MISSED","CANCELLED"), defaultValue: "SCHEDULED" },
  description: { type: DataTypes.TEXT },
  assignedPump: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
}, {
  tableName: "attendants",
  timestamps: true,
});

export default Attendant;
