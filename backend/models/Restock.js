import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import FuelType from './FuelType.js';
import User from './User.js';

const Restock = sequelize.define('Restock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fuelTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FuelType,
      key: 'id',
    },
  },
  attendantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  quantityAdded: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  supplierName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  restockDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

// Associations
Restock.belongsTo(FuelType, { foreignKey: 'fuelTypeId', as: 'fuelType' });
Restock.belongsTo(User, { foreignKey: 'attendantId', as: 'attendant' });

export default Restock;
