// models/FuelType.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const FuelType = sequelize.define("FuelType", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  pricePerLitre: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantityInStock: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default FuelType;
