// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

// Cookie options for consistency
const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 3600000, // 1 hour
};

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// Register user (Admin only)
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role]
    );

    // If role is ATTENDANT, automatically add to attendants table
    if (role === "ATTENDANT") {
      await pool.query(
        "INSERT INTO attendants (name, email, phone, password) VALUES (?, ?, ?, ?)",
        [name, email, "", hashed]
      );
    }

    res.status(201).json({ message: "User registered", user: { id: result.insertId, name, email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = users[0];
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user.id, user.role);

    // Set cookie
    res.cookie("token", token, cookieOpts);

    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
import User from "../models/User.js";

export const getMe = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  res.json({ user: req.user });
};

export const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true });
  res.json({ message: "Logged out successfully" });
};
