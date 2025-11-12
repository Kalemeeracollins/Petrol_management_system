// models/Maintenance.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Maintenance = sequelize.define(
  "Maintenance",
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
    taskType: {
      type: DataTypes.ENUM(
        "PUMP_MAINTENANCE",
        "TANK_CLEANING",
        "EQUIPMENT_REPAIR",
        "SAFETY_CHECK",
        "GENERAL"
      ),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    scheduledTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    estimatedDuration: {
      type: DataTypes.INTEGER, // in hours
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "URGENT"),
      defaultValue: "MEDIUM",
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED"
      ),
      defaultValue: "PENDING",
    },
    assignedPump: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Creative additions for efficiency
    actualDuration: {
      type: DataTypes.INTEGER, // in minutes, recorded when completed
      allowNull: true,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    partsUsed: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "maintenances",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["attendantId"],
      },
      {
        unique: false,
        fields: ["status"],
      },
      {
        unique: false,
        fields: ["scheduledDate"],
      },
      {
        unique: false,
        fields: ["priority"],
      },
    ],
  }
);

// Associations
Maintenance.belongsTo(User, { as: "attendant", foreignKey: "attendantId" });
User.hasMany(Maintenance, { as: "maintenances", foreignKey: "attendantId" });

// Hooks for creative features
Maintenance.addHook("beforeUpdate", (maintenance) => {
  if (maintenance.status === "COMPLETED" && !maintenance.completedAt) {
    maintenance.completedAt = new Date();
  }
});

export default Maintenance;
