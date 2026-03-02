// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import bcrypt from "bcrypt"; // added for password hashing

import sequelize, { connectDB } from "./config/db.js";
import User from "./models/User.js"; // added to seed default users

// Routes
import authRoutes from "./routes/authRoutes.js";
import fuelRoutes from "./routes/fuelRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import shiftRoutes from "./routes/shiftRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import attendantRoutes from "./routes/attendantRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";

// Middleware
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, // allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/attendants", attendantRoutes);
app.use("/api/users", userRoutes);
app.use("/api/maintenance", maintenanceRoutes);

// Test route
app.get("/", (req, res) => res.send("Petrol Station Backend API is running 🚀"));

// Swagger
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(); // ensure DB is connected
    await sequelize.sync({ alter: true }); // sync models with database
    console.log("✅ Database synchronized successfully!");

    // 🌱 Seed default users (if they don't already exist)
    const defaultUsers = [
      {
        name: "admin",
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      },
    ];

    for (const userData of defaultUsers) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData,
      });
      if (created) {
        console.log(`✅ Default user created: ${user.email} (${user.role})`);
      } else {
        console.log(`ℹ️ Default user already exists: ${user.email}`);
      }
    }

    // Start the server after seeding
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();