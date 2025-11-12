import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Expense = sequelize.define("Expense", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  description: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default Expense;
