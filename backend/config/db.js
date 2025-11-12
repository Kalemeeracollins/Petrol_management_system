// config/db.js
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";

dotenv.config();

// Required env vars (except password)
const requiredEnv = ["DB_NAME", "DB_USER", "DB_HOST"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

// MySQL2 pool for raw queries (preferred for auth)
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_MAX || 10),
  queueLimit: 0,
});

// Sequelize instance for models (legacy compatibility)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ MySQL Database connected successfully!");
  } catch (err) {
    console.error("💥 Could not connect to the database:", err.message);
    process.exit(1);
  }
};

export default sequelize;
