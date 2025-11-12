import User from "../models/User.js";

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "active", "createdAt"],
      order: [["createdAt", "DESC"]]
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Toggle user active status (Admin only)
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deactivating themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ message: "Cannot deactivate your own account" });
    }

    user.active = !user.active;
    await user.save();

    res.json({
      message: `User ${user.active ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user status" });
  }
};
