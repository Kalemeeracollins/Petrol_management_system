// models/Shift.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Shift = sequelize.define(
  "Shift",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    attendantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    shiftType: {
      type: DataTypes.ENUM("MORNING", "AFTERNOON", "NIGHT"),
      allowNull: false,
    },
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    scheduledStartTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    scheduledEndTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    actualStartTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualEndTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED",
        "MISSED",
        "CANCELLED"
      ),
      defaultValue: "SCHEDULED",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assignedPump: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Creative additions for efficiency
    duration: {
      type: DataTypes.INTEGER, // in minutes, calculated automatically
      allowNull: true,
    },
    overtime: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
      defaultValue: "MEDIUM",
    },
  },
  {
    tableName: "shifts",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["attendantId", "scheduledDate"],
      },
      {
        unique: false,
        fields: ["status"],
      },
      {
        unique: false,
        fields: ["scheduledDate", "scheduledStartTime"],
      },
    ],
  }
);

// Associations
Shift.belongsTo(User, { as: "attendant", foreignKey: "attendantId" });
User.hasMany(Shift, { as: "shifts", foreignKey: "attendantId" });

// Hooks for creative features
Shift.addHook("beforeCreate", (shift) => {
  // Calculate duration
  const start = new Date(`1970-01-01T${shift.scheduledStartTime}`);
  const end = new Date(`1970-01-01T${shift.scheduledEndTime}`);
  shift.duration = (end - start) / (1000 * 60); // in minutes

  // Check for overtime (shifts > 8 hours)
  if (shift.duration > 480) {
    shift.overtime = true;
  }
});

Shift.addHook("beforeUpdate", (shift) => {
  if (shift.changed("scheduledStartTime") || shift.changed("scheduledEndTime")) {
    const start = new Date(`1970-01-01T${shift.scheduledStartTime}`);
    const end = new Date(`1970-01-01T${shift.scheduledEndTime}`);
    shift.duration = (end - start) / (1000 * 60);
    if (shift.duration > 480) {
      shift.overtime = true;
    }
  }
});

export default Shift;
