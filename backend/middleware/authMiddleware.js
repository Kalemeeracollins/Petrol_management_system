import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes
// Protect route – verify JWT and attach user
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // must match cookie name

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.active) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("Protect middleware error:", err);
    res.status(401).json({ message: "Token invalid" });
  }
};


// Allow only attendants
export const attendantOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "ATTENDANT") {
    return res.status(403).json({ message: "Access denied: Attendants only" });
  }
  next();
};

// Middleware for attendant-only routes
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};
