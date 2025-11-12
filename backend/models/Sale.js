import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";      // Attendant/User model
import FuelType from "./FuelType.js"; // Fuel type model

const FuelSale = sequelize.define(
  "FuelSale",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Foreign Key → FuelType
    fuelTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FuelType,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT", // use RESTRICT to preserve data history
    },

    // Foreign Key → User (attendant)
    attendantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // don't delete sales if user is deleted
    },

    quantitySold: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [0.1], msg: "Quantity sold must be greater than 0" },
      },
    },

    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [0.01], msg: "Total amount must be greater than 0" },
      },
    },

    saleDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    pumpNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: "Pump number must be at least 1" },
      },
    },
  },
  {
    tableName: "fuel_sales",
    timestamps: true,
    underscored: true, // ensures Sequelize-generated fields match DB naming
  }
);

// Associations
FuelSale.belongsTo(User, { as: "attendant", foreignKey: "attendantId" });
FuelSale.belongsTo(FuelType, { as: "fuelType", foreignKey: "fuelTypeId" });

export default FuelSale;
